import prisma from "../../../common/db.js";
import type { SubcategoryCreateInput, SubcategoryUpdateInput } from "./subcategories.type.js";

export const createSubcategoryRepo = async (data: SubcategoryCreateInput) => {
    return await prisma.subCategory.create({
        data,
        include: {
            category: {
                select: { name: true }
            }
        }
    });
};

export const updateSubcategoryRepo = async (subcategoryId: string, data: SubcategoryUpdateInput) => {
    return await prisma.subCategory.update({
        where: {
            id: subcategoryId
        },
        data: data,
        include: {
            category: {
                select: { name: true }
            }
        }
    });
};

export const getSubcategoryByIdRepo = async (subcategoryId: string) => {
    return await prisma.subCategory.findUnique({
        where: { id: subcategoryId },
        include: {
            category: {
                select: { name: true }
            }
        }
    });
};

export const getSubcategoriesByCategoryIdRepo = async (categoryId: string) => {
    return await prisma.subCategory.findMany({
        where: { categoryId: categoryId },
        include: {
            category: {
                select: { name: true }
            }
        }
    });
};

export const getSubcategoryByNameRepo = async (name: string) => {
    return prisma.subCategory.findUnique({
        where: { name },
        select: { id: true }
    });
};

export const getAllSubcategoriesRepo = async () => {
    return await prisma.subCategory.findMany({
        include: {
            category: {
                select: { name: true }
            }
        }
    });
};

export const deleteSubcategoryRepo = async (subcategoryId: string) => {
    return await prisma.subCategory.delete({ where: { id: subcategoryId } });
};