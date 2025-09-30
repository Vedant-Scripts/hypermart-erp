import prisma from "../../../common/db.js";
import type { CategoryCreateInput, CategoryUpdateInput } from "./categories.type.js";

export const createCategoryRepo = async (data: CategoryCreateInput) => {
    return await prisma.category.create({ data });
};

export const updateCategoryRepo = async (categoryId: string, data: CategoryUpdateInput) => {
    return await prisma.category.update({
        where: {
            id: categoryId
        },
        data: data
    });
};

export const getCategoryByIdRepo = async (categoryId: string) => {
    return await prisma.category.findUnique({ where: { id: categoryId } });
};

export const getCategoryByNameRepo = async (name: string) => {
    return await prisma.category.findUnique({ where: { name: name } });
};

export const getAllCategoriesRepo = async () => {
    return await prisma.category.findMany();
};

export const deleteCategoryRepo = async (categoryId: string) => {
    return await prisma.category.delete({ where: { id: categoryId } });
};