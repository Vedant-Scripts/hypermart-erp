import prisma from "../../../common/db.js";
import type { BrandCreateInput, BrandUpdateInput } from "./brands.type.js";

export const createBrandRepo = async (data: BrandCreateInput) => {
    return await prisma.brand.create({ data });
};

export const updateBrandRepo = async (brandId: number, data: BrandUpdateInput) => {
    return await prisma.brand.update({
        where: {
            id: brandId
        },
        data: data
    });
};

export const getBrandByIdRepo = async (brandId: number) => {
    return await prisma.brand.findUnique({ where: { id: brandId } });
};

export const getBrandByNameRepo = async (name: string) => {
    return await prisma.brand.findUnique({ where: { name: name } });
};

export const getAllBrandsRepo = async () => {
    return await prisma.brand.findMany();
};

export const deleteBrandRepo = async (brandId: number) => {
    return await prisma.brand.delete({ where: { id: brandId } });
};