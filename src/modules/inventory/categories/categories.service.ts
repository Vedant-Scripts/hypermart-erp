import { pickDefined } from "../../../common/utils/pickDefined.js";
import { createCategoryRepo, deleteCategoryRepo, getAllCategoriesRepo, getCategoryByIdRepo, getCategoryByNameRepo, updateCategoryRepo } from "./categories.repo.js";
import type { CategoryUpdateInput, CreateCategoryDTO, updateCategoryDTO } from "./categories.type.js";


export const createCategoryService = async (data: CreateCategoryDTO) => {
    const existing = await getCategoryByNameRepo(data.name);
    if (existing) throw new Error('Category already exists');

    return await createCategoryRepo(data);
}


export const updateCategoryService = async (categoryId: string, data: updateCategoryDTO) => {
    const existing = await getCategoryByIdRepo(categoryId);
    if (!existing) throw new Error('Category Not Found');

    if (data.name) {
        const checkUniquenes = await getCategoryByNameRepo(data.name);
        if (checkUniquenes && checkUniquenes.id !== categoryId) throw new Error('Category already Exists')
    }

    const prismaData = pickDefined(data) as CategoryUpdateInput;

    return await updateCategoryRepo(categoryId, prismaData);
}

export const getCategoryByIdService = async (categoryId: string) => {
    return await getCategoryByIdRepo(categoryId);
}

export const getAllCategoriesService = async () => {
    return await getAllCategoriesRepo();
}

// used category logic build after product

export const deleteCategoryService = async (categoryId: string) => {
    // will first check the used category then would delete it

    const existing = await getCategoryByIdRepo(categoryId);
    if (!existing) throw new Error('Category Not Found');

    return await deleteCategoryRepo(categoryId);
}