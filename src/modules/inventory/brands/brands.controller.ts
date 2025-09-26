import type { NextFunction, Request, Response } from "express";
import { createBrandSchema, updateBrandSchema } from "./brands.validation.js";
import type { BrandResponseDTO } from "./brands.type.js";
import { createBrandService, deleteBrandService, getAllBrandsService, getBrandByIdService, updateBrandService } from "./brands.service.js";

export const createBrandController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // validate with zod
        const parsed = createBrandSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ errors: parsed.error });

        // call service
        const brand: BrandResponseDTO = await createBrandService(parsed.data)

        return res.status(201).json({ message: 'Brand Created', data: brand })

    } catch (error) {
        next(error)
    }
}

export const getBrandByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const brandId: number = Number(req.params.id);
        const brand: BrandResponseDTO | null = await getBrandByIdService(brandId);

        if (!brand) return res.status(404).json({ message: "Brand not found" });

        return res.status(200).json({ message: "Brand found", data: brand });
    } catch (error) {
        next(error);
    }

}

export const getAllBrandsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const brands: BrandResponseDTO[] = await getAllBrandsService();
        if (!brands) return res.status(404).json({ message: " No Data Found" });

        return res.status(200).json({ message: "Brands Found", data: brands });
    } catch (error) {
        next(error)
    }

}

export const updateBrandController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // validate with zod

        const parsed = updateBrandSchema.safeParse(req.body);
        const brandId: number = Number(req.params.id);

        if (!parsed.success) return res.status(400).json({ errors: parsed.error });
        // call service 
        const brand: BrandResponseDTO = await updateBrandService(brandId, parsed.data);

        return res.status(200).json({ message: 'Brand Updated', data: brand })
    } catch (error) {
        next(error)
    }

}

export const checkUsedBrandController = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json();
}

export const deleteBrandController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const brandId: number = Number(req.params.id);
        await deleteBrandService(brandId);
        return res.status(204).send();
    } catch (error) {
        next(error)
    }

}