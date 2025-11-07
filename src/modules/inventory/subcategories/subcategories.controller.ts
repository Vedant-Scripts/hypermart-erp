import type { NextFunction, Request, Response } from "express";
import { subcategorySchema, updateSubcategorySchema } from "./subcategories.validation.js";
import { createSubcategoryService, deleteSubcategoryService, getAllSubcategoriesService, getAllSubcategoryByCategoryIdService, getSubcategoryByIdService, updateSubcategoryService } from "./subcategories.service.js";
import type { SubcategoryResponseDTO } from "./subcategories.type.js";

export const createSubcategoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // validate with zod
        const parsed = subcategorySchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ errors: parsed.error });

        // call service
        const subcategory: SubcategoryResponseDTO = await createSubcategoryService(parsed.data)

        return res.status(201).json({ message: 'Subcategory Created', data: subcategory })

    } catch (error) {
        next(error)
    }
}

export const getSubcategoryByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subcategoryId = req.params.id;
        if (!subcategoryId) return res.status(400).json({ message: "Sub Category id is required" });

        const subcategory: SubcategoryResponseDTO | null = await getSubcategoryByIdService(subcategoryId);
        if (!subcategory) return res.status(404).json({ message: "Subcategory not found" });

        return res.status(200).json({ message: "Subcategory found", data: subcategory });
    } catch (error) {
        next(error);
    }

}

export const getAllSubcategoriesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryId = req.query.categoryId ? req.query.categoryId as string : undefined;
        if (categoryId !== undefined) {
            const subcategories: SubcategoryResponseDTO[] = await getAllSubcategoryByCategoryIdService(categoryId);
            if (!subcategories || subcategories.length === 0) return res.status(404).json({ message: "No Data Found" });

            return res.status(200).json({ message: "Subcategories Found", data: subcategories });
        }
        const subcategories: SubcategoryResponseDTO[] = await getAllSubcategoriesService();
        if (!subcategories || subcategories.length === 0) return res.status(404).json({ message: "No Data Found" });

        return res.status(200).json({ message: "Subcategories Found", data: subcategories });
    } catch (error) {
        next(error)
    }

}

export const updateSubcategoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // validate with zod

        const parsed = updateSubcategorySchema.safeParse(req.body);
        const subcategoryId = req.params.id;
        if (!subcategoryId) return res.status(400).json({ message: "Sub Category id is required" });

        if (!parsed.success) return res.status(400).json({ errors: parsed.error });
        // call service 
        const subcategory: SubcategoryResponseDTO = await updateSubcategoryService(subcategoryId, parsed.data);

        return res.status(200).json({ message: 'Subcategory Updated', data: subcategory })
    } catch (error) {
        next(error)
    }

}

export const checkUsedSubcategoryController = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json();
}

export const deleteSubcategoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subcategoryId= req.params.id;
        if (!subcategoryId) return res.status(400).json({ message: "Sub Category id is required" });

        await deleteSubcategoryService(subcategoryId);
        return res.status(204).send();
    } catch (error) {
        next(error)
    }

}