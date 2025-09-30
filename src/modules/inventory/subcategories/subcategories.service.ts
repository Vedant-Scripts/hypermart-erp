import { pickDefined } from "../../../common/utils/pickDefined.js";
import { getCategoryByIdRepo } from "../categories/categories.repo.js";
import { createSubcategoryRepo, deleteSubcategoryRepo, getAllSubcategoriesRepo, getSubcategoriesByCategoryIdRepo, getSubcategoryByIdRepo, getSubcategoryByNameRepo, updateSubcategoryRepo } from "./subcategories.repo.js";
import type { SubcategoryUpdateInput, CreateSubcategoryDTO, updateSubcategoryDTO, SubcategoryCreateInput } from "./subcategories.type.js";


export const createSubcategoryService = async (data: CreateSubcategoryDTO) => {
    const existing = await getSubcategoryByNameRepo(data.name);
    if (existing) throw new Error('Subcategory already exists');

    const dataRepo: SubcategoryCreateInput = {
        name: data.name,
        description: data.description,
        status: data.status,
        category: { connect: { id: data.categoryId } },
    };
    const result = await createSubcategoryRepo(dataRepo);
    const { category, ...rest } = result;
    return { ...rest, categoryName: category.name };
};


export const updateSubcategoryService = async (subcategoryId: string, data: updateSubcategoryDTO) => {
    const existing = await getSubcategoryByIdRepo(subcategoryId);
    if (!existing) throw new Error('Subcategory Not Found');

    if (data.categoryId) {
        const existing = await getCategoryByIdRepo(data.categoryId);
        if (!existing) throw new Error('Category Not Found');
    }
    if (data.name) {
        const checkUniquenes = await getSubcategoryByNameRepo(data.name);
        if (checkUniquenes && checkUniquenes.id !== subcategoryId) throw new Error('Subcategory already Exists')
    }

    const prismaData = pickDefined(data) as SubcategoryUpdateInput;

    const result = await updateSubcategoryRepo(subcategoryId, prismaData);
    const { category, ...rest } = result;
    return { ...rest, categoryName: category.name };
};

export const getSubcategoryByIdService = async (subcategoryId: string) => {
    const result = await getSubcategoryByIdRepo(subcategoryId);
    if (!result) return null;
    const { category, ...rest } = result;
    return { ...rest, categoryName: category.name };
};

export const getAllSubcategoryByCategoryIdService = async (categoryId: string) => {
    const result = await getSubcategoriesByCategoryIdRepo(categoryId);
    if (!result || result.length === 0) return [];
    return result.map(({ category, ...rest }) => ({
        ...rest,
        categoryName: category.name
    }));
};

export const getAllSubcategoriesService = async () => {
    const result = await getAllSubcategoriesRepo();
    if (!result || result.length === 0) return [];
    return result.map(({ category, ...rest }) => ({
        ...rest,
        categoryName: category.name
    }));
};

// used subcategory logic build after product

export const deleteSubcategoryService = async (subcategoryId: string) => {
    // will first check the used subcategory then would delete it

    const existing = await getSubcategoryByIdRepo(subcategoryId);
    if (!existing) throw new Error('Subcategory Not Found');

    return await deleteSubcategoryRepo(subcategoryId);
}