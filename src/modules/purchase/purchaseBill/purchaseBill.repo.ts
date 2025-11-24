import { MovementType, Prisma, type Batch } from "../../../generated/prisma/client.js";
import prisma from "../../../common/db.js";
import type { PurchaseBillCreateInput, PurchaseBillUpdateInput } from "./purchaseBill.type.js"
import { generateBatchNo } from "../../inventory/products/products.repo.js";
import type { PrismaClient } from "../../../generated/prisma/client.js";

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

        const batches = Array.isArray(data.batches) ? data.batches : [];
        if (batches.length === 0) return;

        const batchRecords = [];
        for (const p of batches) {
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
                batches: true
            }
        });

        return purchaseBillWithProducts;
    })
};

export const updatePurchaseBillTransactionRepo = (purchaseBillId: string, dto: any) => {
    const { batches: batchesArray, ...data } = dto as PurchaseBillUpdateInput;

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const purchaseBill = await tx.purchaseBill.update({
            where: {
                id: purchaseBillId
            },
            data: data,
            include: {
                batches: true
            }
        });
        const batches = Array.isArray(batchesArray) ? batchesArray : [];
        if (batches.length === 0) return purchaseBill;

        const existingBatches = await tx.batch.findMany({
            where: { purchaseBillId: purchaseBillId },
            select: { id: true, purchasePrice: true, mrp: true, availableQty: true }
        });

        const newBatches: any[] = [];
        const zeroQtyBatchIds: string[] = [];
        const updateExistingBatches: any[] = [];

        // filtering the data
        for (const batch of batches) {
            const existing = existingBatches.find(b => b.id === batch.id); // can be refined  it is O(N)square

            // 1) Completely new batch
            if (!existing) {

                const { id, ...productWithoutId } = batch;

                newBatches.push({
                    ...productWithoutId,
                    supplierId: purchaseBill.supplierId,
                    purchaseBillId,
                    batchNo: await generateBatchNo(), // can be prosimised and generated all at once
                    receivedQty: batch.availableQty ?? 0
                });
                continue;
            }

            // 2) Price changed (only if client sent new values)
            const priceChanged =
                batch.purchasePrice !== undefined &&
                Number(existing.purchasePrice) !== Number(batch.purchasePrice);

            const mrpChanged =
                batch.mrp !== undefined &&
                Number(existing.mrp) !== Number(batch.mrp);

            if (priceChanged || mrpChanged) {
                zeroQtyBatchIds.push(existing.id);

                const { id, ...productWithoutId } = batch;

                newBatches.push({
                    ...productWithoutId,
                    supplierId: purchaseBill.supplierId,
                    purchaseBillId,
                    batchNo: await generateBatchNo(),
                    receivedQty: batch.availableQty ?? 0
                });

                continue;
            }

            // 3) Qty update
            let qtyDelta = null;

            if (batch.availableQty !== undefined) {
                const existingQty = existing.availableQty ?? 0;
                const newQty = batch.availableQty;
                qtyDelta = newQty - existingQty;
            }

            updateExistingBatches.push({
                ...batch,
                ...(qtyDelta !== null && { qtyDelta })
            });
        }

        // updating zero qty batch ids
        if (zeroQtyBatchIds.length > 0) {
            const oldBatchData = await tx.batch.findMany({
                where: { id: { in: zeroQtyBatchIds } },
                select: { id: true, productId: true, variantId: true, availableQty: true }
            });

            const zeroMovements = [];

            for (const batch of oldBatchData) {
                if (batch.availableQty <= 0) continue;
                await adjustCachedQty(tx, batch, 'decrement', batch.availableQty);

                zeroMovements.push({
                    productId: batch.productId,
                    variantId: batch.variantId,
                    batchId: batch.id,
                    type: MovementType.PURCHASE_BILL,
                    qty: 0,
                    qtyDelta: -batch.availableQty,
                    unitPrice: null,
                    referenceType: 'QTY_ZEROED',
                    referenceId: purchaseBillId,
                    createdBy: null,
                });
            }

            await tx.batch.updateMany({
                where: { id: { in: zeroQtyBatchIds } },
                data: { availableQty: 0 }
            });

            await tx.stockMovement.createMany({
                data: zeroMovements
            });

        }
        // new batches
        if (newBatches.length > 0) {
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
            const newStockMovements: any[] = [];
            for (const batch of updateExistingBatches) {
                const { qtyDelta, ...batchData } = batch;

                await tx.batch.update({
                    where: { id: batch.id },
                    data: batchData
                });

                if (!qtyDelta || qtyDelta === 0) continue;

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

        const purchaseBillWithProducts = await getPurchaseBillByIdRepo(purchaseBillId, tx);
        return purchaseBillWithProducts;
    });
};

export const getPurchaseBillByIdRepo = async (purchaseBillId: string, client: Prisma.TransactionClient | PrismaClient = prisma) => {

    const purchaseBill = await client.purchaseBill.findUnique({
        where: { id: purchaseBillId }
    })

    const batches: Batch[] = await client.$queryRaw`
    SELECT DISTINCT ON ("product_id", "variant_id") *
    FROM "batch"
    WHERE "purchase_bill_id" = ${purchaseBillId}
    ORDER BY 
      "product_id",
      "variant_id",
      "created_at" DESC;
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
    if (qtyChange <= 0) return; // can be looked into for batch wise update or create 

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