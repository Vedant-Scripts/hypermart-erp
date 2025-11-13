import { MovementType, PaymentStatus, Prisma, type Batch } from "@prisma/client";
import prisma from "../../../common/db.js";
import type { PurchaseBillCreateInput, PurchaseBillUpdateInput } from "./purchaseBill.type.js"
import { generateBatchNo } from "../../inventory/products/products.repo.js";

export const createPurchaseBillTransactionRepo = (dto: any) => {
    const data = dto as PurchaseBillCreateInput;

    return prisma.$transaction(async (tx) => {

        const purchaseBill = await tx.purchaseBill.create({
            data: {
                supplierId: data.supplierId,
                purchaseBillDate: data.purchaseBillDate,
                purchaseBillNo: await generatePurchaseBillNo(),    // get the next purchaseBill no
                paymentStatus: data.paymentStatus ?? 'PENDING',
                flatDiscountType: data.flatDiscountType ?? 'PERCENT',
                flatDiscount: data.flatDiscount ?? 0,
                grossDiscount: data.grossDiscount ?? 0,
                discount: data.discount ?? 0,
                taxableAmount: data.taxableAmount ?? 0,
                tax: data.tax ?? 0,
                roundOff: data.roundOff ?? 0,
                netAmount: data.netAmount
            }
        });

        const products = Array.isArray(data.products) ? data.products : [];
        if (products.length === 0) return;

        const batchRecords = [];
        for (const p of products) {
            const batchNo = await generateBatchNo();
            batchRecords.push({
                ...p,
                batchNo,
                supplierId: purchaseBill.supplierId,
                purchaseBillId: purchaseBill.id,
                receivedQty: p.availableQty,
            });
        }

        await tx.batch.createMany({ data: batchRecords });

        const insertedBatches = await tx.batch.findMany({
            where: { purchaseBillId: purchaseBill.id },
            select: { id: true, productId: true, variantId: true, purchasePrice: true, availableQty: true }
        })

        const stockMovements = insertedBatches.map(b => ({
            productId: b.productId,
            variantId: b.variantId ?? null,
            batchId: b.id,
            type: MovementType.PURCHASE_BILL,
            qty: b.availableQty,
            qtyDelta: b.availableQty,
            unitPrice: b.purchasePrice,
            referenceType: 'PURCHASE_BILL',
            referenceId: purchaseBill.id,
            createdBy: null,
        }));

        await tx.stockMovement.createMany({
            data: stockMovements
        });

        for (const insertedBatch of insertedBatches) {
            await adjustCachedQty(tx, insertedBatch, 'increment', insertedBatch.availableQty);
        }

        const purchaseBillWithProducts = await tx.purchaseBill.findUnique({
            where: { id: purchaseBill.id },
            include: {
                products: true
            }
        });

        return purchaseBillWithProducts;
    })
};

export const updatePurchaseBillTransactionRepo = (purchaseBillId: string, dto: any) => {
    const { products: productsArray, ...data } = dto as PurchaseBillUpdateInput;

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const purchaseBill = await tx.purchaseBill.update({
            where: {
                id: purchaseBillId
            },
            data: data,
            include: {
                products: true
            }
        });
        const products = Array.isArray(productsArray) ? productsArray : [];
        if (products.length === 0) return purchaseBill;

        const existingBatches = await tx.batch.findMany({
            where: { purchaseBillId: purchaseBillId },
            select: { id: true, purchasePrice: true, mrp: true, availableQty: true }
        });

        const newBatches: any[] = [];
        const zeroQtyBatchIds: string[] = [];
        const updateExistingBatches: any[] = [];

        // filtering the data
        for (const product of products) {
            const existing = existingBatches.find(b => b.id === product.id);

            if (!existing) {
                console.log("[FLOW] check batch");
                // brand new batch
                const { id, ...productWithoutId } = product;

                newBatches.push({
                    ...productWithoutId,
                    supplierId: purchaseBill.supplierId,
                    purchaseBillId,
                    batchNo: await generateBatchNo(),
                    receivedQty: product.availableQty
                });
            } else if (Number(existing.purchasePrice) !== Number(product.purchasePrice) || Number(existing.mrp) !== Number(product.mrp)) {
                console.log(
                    `[PRICE CHANGE] existingBatchId=${existing.id} ` +
                    `purchasePrice ${existing.purchasePrice} -> ${product.purchasePrice}, ` +
                    `mrp ${existing.mrp} -> ${product.mrp}`
                );
                zeroQtyBatchIds.push(existing.id);

                const { id, ...productWithoutId } = product;
                newBatches.push({
                    ...productWithoutId,
                    supplierId: purchaseBill.supplierId,
                    purchaseBillId,
                    batchNo: await generateBatchNo(),
                    receivedQty: product.availableQty
                });

            } else {
                console.log("[FLOW] qty update");
                const existingQty = existing.availableQty ?? 0;
                const newQty = product.availableQty ?? 0;
                const qtyDelta = newQty - existingQty;

                updateExistingBatches.push({
                    ...product,
                    qtyDelta
                });
            }
        }
        console.log('newBatches: ', newBatches);
        console.log('zeroQtyBatchIds: ', zeroQtyBatchIds);
        console.log('updateExistingBatches: ', updateExistingBatches);

        // updating zero qty batch ids
        if (zeroQtyBatchIds.length > 0) {
            console.log("in zero qty");
            const oldBatchData = await tx.batch.findMany({
                where: { id: { in: zeroQtyBatchIds } },
                select: { id: true, productId: true, variantId: true, availableQty: true }
            });

            for (const batch of oldBatchData) {
                await adjustCachedQty(tx, batch, 'decrement', batch.availableQty)
            }

            await tx.batch.updateMany({
                where: { id: { in: zeroQtyBatchIds } },
                data: { availableQty: 0 }
            });

            await tx.stockMovement.updateMany({
                where: { batchId: { in: zeroQtyBatchIds } },
                data: { qty: 0, qtyDelta: 0, referenceType: 'QTY_ZEROED' }
            });
        }
        // new batches
        if (newBatches.length > 0) {
            console.log("in NEW bATCH");
            const newBatchData = await tx.batch.createManyAndReturn({
                data: newBatches,
                select: { id: true, productId: true, variantId: true, purchasePrice: true, availableQty: true }
            });

            const newStockMovements: any[] = [];
            for (const batch of newBatchData) {
                await adjustCachedQty(tx, batch, 'increment', batch.availableQty);

                newStockMovements.push({
                    productId: batch.productId ?? null,
                    variantId: batch.variantId ?? null,
                    batchId: batch.id,
                    type: MovementType.PURCHASE_BILL,
                    qty: batch.availableQty,
                    qtyDelta: batch.availableQty,
                    unitPrice: batch.purchasePrice,
                    referenceType: 'PURCHASE_BILL',
                    referenceId: purchaseBillId,
                    createdBy: null,
                })
            }

            await tx.stockMovement.createMany({
                data: newStockMovements
            });
        }

        if (updateExistingBatches.length > 0) {
            console.log("in UPDATE eXISTING bATCHES");
            const newStockMovements: any[] = [];
            for (const batch of updateExistingBatches) {
                const { qtyDelta, ...batchData } = batch;

                await tx.batch.update({
                    where: { id: batch.id },
                    data: batchData
                });
                console.log('batchData: ', batchData);

                if (!qtyDelta || qtyDelta === 0) continue;
                console.log("going for  adjustment in existing batches");
                // Determine increment/decrement direction
                const operationMode: 'increment' | 'decrement' =
                    qtyDelta > 0 ? 'increment' : 'decrement';

                await adjustCachedQty(tx, batch, operationMode, Math.abs(qtyDelta));

                newStockMovements.push({
                    productId: batch.productId ?? null,
                    variantId: batch.variantId ?? null,
                    batchId: batch.id,
                    type: MovementType.PURCHASE_BILL,
                    qty: batch.availableQty,
                    qtyDelta: qtyDelta,
                    unitPrice: batch.purchasePrice,
                    referenceType: 'PURCHASE_BILL',
                    referenceId: purchaseBillId,
                    createdBy: null,
                })
            }
            await tx.stockMovement.createMany({
                data: newStockMovements
            });
        }

        // const purchaseBillWithProducts = await tx.purchaseBill.findUnique({
        //     where: { id: purchaseBillId },
        //     include: {
        //         products: true
        //     }
        // });
        const purchaseBillWithProducts = await getPurchaseBillByIdRepo(purchaseBillId);
        return purchaseBillWithProducts;
    });
};

export const getPurchaseBillByIdRepo = async (purchaseBillId: string) => {

    const purchaseBill = await prisma.purchaseBill.findUnique({
        where: { id: purchaseBillId }
    })

    const batches: Batch[] = await prisma.$queryRaw`
    SELECT DISTINCT ON ("product_id", "variant_id") *
    FROM "batch"
    WHERE "purchase_bill_id" = ${purchaseBillId}
    ORDER BY 
      "product_id",
      "variant_id",
      "createdAt" DESC;
`;
    return { ...purchaseBill, batches }
};

export const getAllPurchaseBillRepo = () => {
    return prisma.purchaseBill.findMany({
        select: {
            id: true,
            paymentStatus: true,
            purchaseBillNo: true,
            netAmount: true,
            purchaseBillDate: true,
            tax: true,
            supplier: { select: { name: true } },
        },
        orderBy: { purchaseBillDate: 'desc' },
    })
};

export const deletePurchaseBillTransactionRepo = () => {

}

async function adjustCachedQty(
    tx: Prisma.TransactionClient,
    batch: { variantId?: string | null; productId?: string | null; },
    mode: 'increment' | 'decrement',
    qtyChange: number
) {
    if (qtyChange <= 0) return;

    if (batch.variantId) {
        const variant = await tx.variant.update({
            where: { id: batch.variantId },
            data: { cachedQty: { [mode]: qtyChange } },
            select: { productId: true },
        });
        await tx.product.update({
            where: { id: variant.productId },
            data: { cachedQty: { [mode]: qtyChange } },
            select: { id: true },
        });
    } else if (batch.productId) {
        await tx.product.update({
            where: { id: batch.productId },
            data: { cachedQty: { [mode]: qtyChange } },
            select: { id: true },
        });
    }
};

const generatePurchaseBillNo = async () => {
    const res: any = await prisma.$queryRaw`SELECT nextval('purchase_bill_no_seq') AS seq`;
    const nextNumber = res[0].seq; // say 42
    const purchaseBillNo = `PB${nextNumber.toString().padStart(9, '0')}`;
    return purchaseBillNo;
}