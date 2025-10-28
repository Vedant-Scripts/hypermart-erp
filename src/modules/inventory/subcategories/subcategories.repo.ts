import prisma from "../../../common/db.js";
import type { SubcategoryCreateInput, SubcategoryUpdateInput } from "./subcategories.type.js";

export const createSubcategoryRepo = (data: SubcategoryCreateInput) => {
    return prisma.subcategory.create({
        data,
        include: {
            category: {
                select: { name: true }
            }
        }
    });
};

export const updateSubcategoryRepo = (subcategoryId: string, data: SubcategoryUpdateInput) => {
    return prisma.subcategory.update({
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

export const getSubcategoryByIdRepo = (subcategoryId: string) => {
    return prisma.subcategory.findUnique({
        where: { id: subcategoryId },
        include: {
            category: {
                select: { name: true }
            }
        }
    });
};

export const getSubcategoriesByCategoryIdRepo = (categoryId: string) => {
    return prisma.subcategory.findMany({
        where: { categoryId: categoryId },
        include: {
            category: {
                select: { name: true }
            }
        }
    });
};

export const getSubcategoryByNameRepo = (name: string) => {
    return prisma.subcategory.findUnique({
        where: { name },
        select: { id: true }
    });
};

export const getAllSubcategoriesRepo = () => {
    return prisma.subcategory.findMany({
        include: {
            category: {
                select: { name: true }
            }
        }
    });
};

export const deleteSubcategoryRepo = (subcategoryId: string) => {
    return prisma.subcategory.delete({ where: { id: subcategoryId } });
};