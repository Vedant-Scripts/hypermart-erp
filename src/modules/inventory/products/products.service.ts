import type { Prisma } from "@prisma/client";
import { generateBarcodeNo } from "../../../common/utils/barcode.utils.js";
import { pickDefined } from "../../../common/utils/pickDefined.utils.js";
import { checkProductFieldExistByRepo, createProductsWithRelationsRepo, deleteProductTransactionRepo, deleteVariantTransactionRepo, getAllProductsRepo, getItemCodeFromItemCodeRegistryRepo, getProductByIdRepo, getProductCountByFieldRepo, updateBatchDetailsRepo, updateProductDetailsRepo, updateVariantDetailsRepo } from "./products.repo.js";
import type { CreateProductDTO, ProductUpdateInput, UpdateBatchDTO, UpdateProductDTO, UpdateVariantDTO } from "./products.type.js";

export const generateBarcodeService = () => {
    return generateBarcodeNo();
}

export const createProductService = async (data: CreateProductDTO) => {
    const checkProductName = await getProductCountByFieldRepo('productName', data.productName);
    if (checkProductName && checkProductName !== 0) throw new Error('Product Name already exists');

    if (data.productType === 'VARIANT' && data.itemCode)
        throw new Error('Variant products cannot have direct itemCode');

    if (data.productType === 'SINGLE' && !data.itemCode)
        throw new Error('Single product must have an itemCode');

    if (data.productType === "SINGLE") {

        const checkItemCode = await getProductCountByFieldRepo('itemCode', data.itemCode!);
        if (checkItemCode && checkItemCode !== 0) throw new Error('Item Code already exists');

    } else {

        const variants = Array.isArray(data.variants) && data.variants.length ? data.variants : [];
        let vItemCodes: string[] = [];

        for (const v of variants) {
            if (!v.itemCode) continue;
            vItemCodes.push(v.itemCode);
        }

        if (vItemCodes.length > 0) {
            const checkVariantItemCode = await getProductCountByFieldRepo('itemCode', vItemCodes);
            if (checkVariantItemCode && checkVariantItemCode !== 0) throw new Error('Variant Item Code already exists');
        }
    }
    return createProductsWithRelationsRepo(data);
}

export const getAllProductsService = async () => {
    const result = await getAllProductsRepo();
    if (!result || result.length === 0) return [];
    return result.map(({ category, brand, batch, ...rest }) => ({
        ...rest,
        brandName: brand.name,
        categoryName: category.name,
        mrp: batch[0]?.mrp ?? 0,
        sellingPrice: batch[0]?.sellingPrice ?? 0

    }));
}

export const getProductByIdService = async (productId: string) => {
    const result = await getProductByIdRepo(productId);
    if (!result) return null;
    const { category, brand, unit, ...rest } = result;
    return {
        ...rest,
        brandName: brand.name,
        categoryName: category.name,
        unitName: unit.unitName
    };
}

export const updateProductService = async ({
    productId,
    variantId,
    batchId,
}: {
    productId?: string;
    variantId?: string;
    batchId?: string;
}, data: UpdateProductDTO | UpdateVariantDTO | UpdateBatchDTO) => {

    if (productId) {
        if ('itemCode' in data && data.itemCode !== undefined && data.itemCode !== null) {
            const getItemCode = await getItemCodeFromItemCodeRegistryRepo('PRODUCT', productId);
            if (getItemCode?.itemCode !== data.itemCode) {
                const checkItemCode = await getProductCountByFieldRepo('itemCode', data.itemCode);
                if (checkItemCode && checkItemCode !== 0) throw new Error('Item Code already exists');
            }
        }
        if ('productName' in data && data.productName !== undefined && data.productName !== null) {
            const getProductName = await checkProductFieldExistByRepo('id', productId, ['id', 'productName']) as any;
            if (getProductName?.productName !== data.productName) {
                const checkProductName = await getProductCountByFieldRepo('productName', data.productName);
                if (checkProductName && checkProductName !== 0) throw new Error('Product Name already exists');
            }

        }
        const prismaData = pickDefined(data) as Prisma.ProductUpdateInput;
        return updateProductDetailsRepo(productId, prismaData);
    }

    if (variantId) {
        if ('itemCode' in data && data.itemCode !== undefined && data.itemCode !== null) {
            const getItemCode = await getItemCodeFromItemCodeRegistryRepo('VARIANT', variantId);
            if (getItemCode?.itemCode !== data.itemCode) {
                const checkItemCode = await getProductCountByFieldRepo('itemCode', data.itemCode);
                if (checkItemCode && checkItemCode !== 0) throw new Error('Item Code already exists');
            }
        }
        const prismaData = pickDefined(data) as Prisma.VariantUpdateInput;
        return updateVariantDetailsRepo(variantId, prismaData);
    }

    if (batchId) {
        const prismaData = pickDefined(data) as Prisma.BatchUpdateInput;
        return updateBatchDetailsRepo(batchId, prismaData);
    }

    throw new Error('No valid identifier provided');
}

export const checkProductExistService = async (field: string, value: string) => {
    const checkCount = await getProductCountByFieldRepo(field as keyof Prisma.ProductWhereInput, value);
    return checkCount > 0 ? true : false;
}

export const deleteProductOrVariantService = (productId?: string, variantId?: string) => {
    if (!productId && !variantId) throw new Error('Id is mandatory');

    return productId
        ? deleteProductTransactionRepo(productId)
        : deleteVariantTransactionRepo(variantId!);
}