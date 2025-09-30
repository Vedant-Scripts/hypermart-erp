import type { NextFunction, Request, Response } from "express";
import { createUnitSchema, updateUnitSchema } from "./units.validation.js";
import type { UnitResponseDTO } from "./units.type.js";
import { createUnitService, deleteUnitService, getAllUnitsService, getUnitByIdService, updateUnitService } from "./units.service.js";

export const createUnitController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // validate with zod
        const parsed = createUnitSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ errors: parsed.error });

        // call service
        const unit: UnitResponseDTO = await createUnitService(parsed.data)

        return res.status(201).json({ message: 'Unit Created', data: unit })

    } catch (error) {
        next(error)
    }
}

export const getUnitByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const unitId = req.params.id;
        if (!unitId) return res.status(400).json({ message: "Unit id is required" });

        const unit: UnitResponseDTO | null = await getUnitByIdService(unitId);
        if (!unit) return res.status(404).json({ message: "Unit not found" });

        return res.status(200).json({ message: "Unit found", data: unit });
    } catch (error) {
        next(error);
    }

}

export const getAllUnitsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const units: UnitResponseDTO[] = await getAllUnitsService();
        if (!units) return res.status(404).json({ message: "No Data Found" });

        return res.status(200).json({ message: "Units Found", data: units });
    } catch (error) {
        next(error)
    }

}

export const updateUnitController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const unitId = req.params.id;
        if (!unitId) return res.status(400).json({ message: "Unit id is required" });

        // validate with zod
        const parsed = updateUnitSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ errors: parsed.error });
        
        // call service 
        const unit: UnitResponseDTO = await updateUnitService(unitId, parsed.data);

        return res.status(200).json({ message: 'Unit Updated', data: unit })
    } catch (error) {
        next(error)
    }

}

export const checkUsedUnitController = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json();
}

export const deleteUnitController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const unitId = req.params.id;
        if (!unitId) return res.status(400).json({ message: "Unit id is required" });

        await deleteUnitService(unitId);
        return res.status(204).send();
    } catch (error) {
        next(error)
    }

}