import type { NextFunction, Request, Response } from "express";
import { categorySchema, updateCategorySchema } from "./categories.validation.js";
import { createCategoryService, deleteCategoryService, getAllCategoriesService, getCategoryByIdService, updateCategoryService } from "./categories.service.js";
import type { CategoryResponseDTO } from "./categories.type.js";

export const createCategoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // validate with zod
        const parsed = categorySchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ errors: parsed.error });

        // call service
        const category: CategoryResponseDTO = await createCategoryService(parsed.data)

        return res.status(201).json({ message: 'Category Created', data: category })

    } catch (error) {
        next(error)
    }
}

export const getCategoryByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryId: number = Number(req.params.id);
        const category: CategoryResponseDTO | null = await getCategoryByIdService(categoryId);

        if (!category) return res.status(404).json({ message: "Category not found" });

        return res.status(200).json({ message: "Category found", data: category });
    } catch (error) {
        next(error);
    }

}

export const getAllCategoriesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories: CategoryResponseDTO[] = await getAllCategoriesService();
        if (!categories) return res.status(404).json({ message: " No Data Found" });

        return res.status(200).json({ message: "Categories Found", data: categories });
    } catch (error) {
        next(error)
    }

}

export const updateCategoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // validate with zod

        const parsed = updateCategorySchema.safeParse(req.body);
        const categoryId: number = Number(req.params.id);

        if (!parsed.success) return res.status(400).json({ errors: parsed.error });
        // call service 
        const category: CategoryResponseDTO = await updateCategoryService(categoryId, parsed.data);

        return res.status(200).json({ message: 'Category Updated', data: category })
    } catch (error) {
        next(error)
    }

}

export const checkUsedCategoryController = (req: Request, res: Response, next: NextFunction) => {
return res.status(200).json();
}

export const deleteCategoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryId: number = Number(req.params.id);
        await deleteCategoryService(categoryId);
        return res.status(204).send();
    } catch (error) {
        next(error)
    }

}