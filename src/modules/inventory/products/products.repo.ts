import { EntityType, MovementType, Prisma } from "@prisma/client";
import prisma from "../../../common/db.js";
import type { BatchUpdateInput, ProductCreateInput, ProductUpdateInput, VariantUpdateInput } from "./products.type.js";

export const createProductsWithRelationsRepo = (dto: any) => {
    const data = dto as ProductCreateInput;
    return prisma.$transaction(async (tx) => {
        const product = await tx.product.create({
            data: {
                itemCode: data.itemCode || null,
                productName: data.productName,
                printName: data.printName,
                productType: data.productType, // "SINGLE" | "VARIANT"

                categoryId: data.categoryId,
                subcategoryId: data.subcategoryId || null,
                brandId: data.brandId,
                unitId: data.unitId,
                hsnCode: data.hsnCode || null,

                purchaseTax: data.purchaseTax || "0",
                salesTax: data.salesTax || "0",
                purchaseTaxIncluding: data.purchaseTaxIncluding ?? false,
                salesTaxIncluding: data.salesTaxIncluding ?? true,

                manageMultipleBatch: data.manageMultipleBatch ?? true,
                hasExpiry: data.hasExpiry ?? true,

                description: data.description || null,
                shortDesc: data.shortDesc || null,

                cachedQty: 0
            },
        });

        if (product.itemCode !== null) {
            await tx.itemCodeRegistry.create({
                data: {
                    itemCode: product.itemCode,
                    entityType: 'PRODUCT',
                    entityId: product.id
                }
            });
        }

        const createBatchAndStockMovement = async (opts: {
            productId?: string | null;
            batch?: any,
            variantId?: string | null;
            createdBy?: string | null;
            referenceType?: string | null;
            referenceId?: string | null;
        }) => {
            const { productId, variantId, batch, createdBy, referenceType, referenceId } = opts;

            // generate batchNo via sequence
            const batchNo = await generateBatchNo();

            // create batch
            const createBatch = await tx.batch.create({
                data: {
                    productId: productId ?? null,
                    variantId: variantId ?? null,
                    batchNo: batchNo,
                    mfgDate: batch.mfgDate ?? null,
                    expDate: batch.expDate ?? null,
                    expDays: batch.expDays ?? null,
                    purchasePrice: batch.purchasePrice,
                    landingCost: batch.landingCost,
                    mrp: batch.mrp,
                    sellingDiscount: batch.sellingDiscount,
                    sellingPrice: batch.sellingPrice,
                    sellingMargin: batch.sellingMargin,
                    availableQty: batch.availableQty,
                    receivedQty: batch.availableQty,
                    supplierId: batch.supplierId ?? null,
                    supplierBillId: batch.supplierBillId ?? null
                }
            });

            // create stock movement if quantity > 0
            if (batch.availableQty > 0) {
                await tx.stockMovement.create({
                    data: {
                        productId: product.id,
                        variantId: variantId ?? null,
                        batchId: createBatch.id,
                        type: MovementType.PURCHASE,
                        qty: createBatch.availableQty,
                        unitPrice: batch.purchasePrice,
                        referenceType: 'adjustment',
                        referenceId: null,
                        createdBy: null,
                    }
                })
            };

            // update cachedQty on variant and product
            if (variantId) {
                await tx.variant.update({
                    where: { id: variantId },
                    data: { cachedQty: { increment: createBatch.availableQty } },
                });
            }

            await tx.product.update({
                where: { id: product.id },
                data: { cachedQty: { increment: createBatch.availableQty } },
            });
        };

        if (data.productType === "SINGLE") {
            const batches = Array.isArray(data.batch) && data.batch.length ? data.batch : [{}];
            for (const b of batches) {
                await createBatchAndStockMovement({
                    productId: product.id,
                    variantId: null,
                    batch: b,
                    createdBy: null,
                });
            };
        };

        if (data.productType === 'VARIANT') {
            const variants = Array.isArray(data.variants) && data.variants.length ? data.variants : [{}];
            for (const v of variants) {
                const variant = await tx.variant.create({
                    data: {
                        productId: product.id,
                        itemCode: v.itemCode,
                        variantName: v.variantName,
                        cachedQty: 0
                    }
                });

                await tx.itemCodeRegistry.create({
                    data: {
                        itemCode: variant.itemCode,
                        entityType: 'VARIANT',
                        entityId: variant.id
                    }
                });

                const variantBatches = Array.isArray(v.batch) && v.batch.length ? v.batch : [{}];
                for (const vb of variantBatches) {
                    await createBatchAndStockMovement({
                        productId: null,
                        variantId: variant.id,
                        batch: vb,
                        createdBy: null,
                    })
                };
            };
        };

        const productWithRelations = await tx.product.findUnique({
            where: { id: product.id },
            include: {
                variants: { include: { batch: true } },
                batch: true,
                stockMovements: true,
            },
        });
        return productWithRelations;
    });
}

export const getAllProductsRepo = () => {
    return prisma.product.findMany({
        select: {
            id: true,
            itemCode: true,
            productName: true,
            printName: true,
            hsnCode: true,
            cachedQty: true,
            productType: true,
            category: { select: { name: true } },
            brand: { select: { name: true } },
            batch: {
                select: { mrp: true, sellingPrice: true },
                orderBy: { createdAt: 'desc' }
            },
        }


    });
}

export const getProductByIdRepo = (productId: string) => {
    return prisma.product.findUnique({
        where: { id: productId },
        include: {
            category: { select: { name: true } },
            brand: { select: { name: true } },
            unit: { select: { unitName: true } },
            batch: true,
            variants: {
                include: { batch: true }
            }
        }
    });
}

export const getProductCountByFieldRepo = (field: keyof Prisma.ProductWhereInput, value: string | string[]) => {
    const where = Array.isArray(value) ? { [field]: { in: value } } : { [field]: value };
    if (field === 'itemCode') {
        return prisma.itemCodeRegistry.count({ where });
    } else {
        return prisma.product.count({ where });
    }
}

export const updateProductDetailsRepo = (productId: string, dto: any) => {
    const data = dto as ProductUpdateInput;
    return prisma.product.update({
        where: { id: productId },
        data
    });
}

export const updateVariantDetailsRepo = (variantId: string, dto: any) => {
    const data = dto as VariantUpdateInput;
    return prisma.variant.update({
        where: { id: variantId },
        data
    })
}

export const updateBatchDetailsRepo = (batchId: string, dto: any) => {
    const data = dto as BatchUpdateInput;
    return prisma.batch.update({
        where: { id: batchId },
        data
    });
}

export const deleteProductWithRelations = (productId: string, data: any) => {

};

export const getItemCodeFromItemCodeRegistryRepo = (entityType: EntityType, entityId: string) => {
    return prisma.itemCodeRegistry.findFirst({ where: { entityType: entityType, entityId: entityId }, select: { itemCode: true } });
}

export const checkProductFieldExistByRepo = (field: string, value: string, selectVal: string[]) => {
    let select: Record<string, boolean> = {}
    for (const s of selectVal) {
        select[s] = true;
    }
    return prisma.product.findFirst({ where: { [field]: value }, select });
}


const generateBatchNo = async () => {
    const res: any = await prisma.$queryRaw`SELECT nextval('batch_no_seq') AS seq`;
    const nextNumber = res[0].seq; // say 42
    const batchNo = `B${nextNumber.toString().padStart(9, '0')}`;
    return batchNo;
}