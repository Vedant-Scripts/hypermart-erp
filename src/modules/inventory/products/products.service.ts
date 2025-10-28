import type { Prisma } from "@prisma/client";
import { generateBarcodeNo } from "../../../common/utils/barcode.utils.js";
import { pickDefined } from "../../../common/utils/pickDefined.utils.js";
import { createProductsWithRelationsRepo, getAllProductsRepo, getProductByIdRepo, getProductCountByFieldRepo, updateBatchDetailsRepo, updateProductDetailsRepo, updateVariantDetailsRepo } from "./products.repo.js";
import type { CreateProductDTO, ProductUpdateInput, UpdateBatchDTO, UpdateProductDTO, UpdateVariantDTO } from "./products.type.js";


export const generateBarcodeService = () => {
    return generateBarcodeNo();
}

export const createProductService = async (data: CreateProductDTO) => {
    const checkCount = await getProductCountByFieldRepo('productName', data.productName);
    if (checkCount && checkCount !== 0) throw new Error('Product already exists');

    if (data.productType === 'VARIANT' && data.itemCode)
        throw new Error('Variant products cannot have direct itemCode');

    if (data.productType === 'SINGLE' && !data.itemCode)
        throw new Error('Single product must have an itemCode');

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
    if (batchId) {
        const prismaData = pickDefined(data) as Prisma.BatchUpdateInput;
        return await updateBatchDetailsRepo(batchId, prismaData);
    }
    if (variantId) {
        const prismaData = pickDefined(data) as Prisma.VariantUpdateInput;
        return await updateVariantDetailsRepo(variantId, prismaData);
    }

    if (productId) {
        const prismaData = pickDefined(data) as Prisma.ProductUpdateInput;
        return await updateProductDetailsRepo(productId, prismaData);
    }

    throw new Error('No valid identifier provided');
}

export const checkProductExistService = async (field: string, value: string) => {
    console.log('field: ', field);
    console.log('value: ', value);
    const checkCount = await getProductCountByFieldRepo(field as keyof Prisma.ProductWhereInput, value);
    return checkCount > 0 ? true : false;
}