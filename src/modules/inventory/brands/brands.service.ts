import { pickDefined } from "../../../common/utils/pickDefined.utils.js";
import { createBrandRepo, deleteBrandRepo, getAllBrandsRepo, getBrandByIdRepo, getBrandByNameRepo, updateBrandRepo } from "./brands.repo.js";
import type { BrandUpdateInput, CreateBrandDTO, updateBrandDTO } from "./brands.type.js";


export const createBrandService = async (data: CreateBrandDTO) => {
    const existing = await getBrandByNameRepo(data.name);
    if (existing) throw new Error('Brand already exists');

    return await createBrandRepo(data);
}


export const updateBrandService = async (brandId: string, data: updateBrandDTO) => {
    const existing = await getBrandByIdRepo(brandId);
    if (!existing) throw new Error('Brand Not Found');

    if (data.name) {
        const checkUniquenes = await getBrandByNameRepo(data.name);
        if (checkUniquenes && checkUniquenes.id !== brandId) throw new Error('Brand already Exists')
    }

    const prismaData = pickDefined(data) as BrandUpdateInput;

    return await updateBrandRepo(brandId, prismaData);
}

export const getBrandByIdService = async (brandId: string) => {
    return await getBrandByIdRepo(brandId);
}

export const getAllBrandsService = async () => {
    return await getAllBrandsRepo();
}

// used brand logic build after product

export const deleteBrandService = async (brandId: string) => {
    // will first check the used brand then would delete it

    const existing = await getBrandByIdRepo(brandId);
    if (!existing) throw new Error('Brand Not Found');

    return await deleteBrandRepo(brandId);
}