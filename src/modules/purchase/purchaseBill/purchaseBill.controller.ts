import type { NextFunction, Request, Response } from "express";
import { createPurchaseBillPayloadSchema, updatePurchaseBillPayloadSchema } from "./purchaseBill.validation.js";
import { createPurchaseBillService, getAllPurchaseBillService, getPurchaseBillByIdService, updatePurchaseBillService } from "./purchaseBill.service.js";

export const createPurchaseBillController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = createPurchaseBillPayloadSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ errors: parsed.error });

        // call service
        const purchaseBill = await createPurchaseBillService(parsed.data);

        return res.status(201).json({ message: 'Purchase Bill Created', data: purchaseBill });
    } catch (error) {
        next(error);
    }
}

export const getPurchaseBillByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const purchaseBillId = req.params.id;
        if (!purchaseBillId) return res.status(400).json({ message: "Purchase Bill id is required" });

        const result = await getPurchaseBillByIdService(purchaseBillId);

        if (!result) return res.status(404).json({ message: "Purchase Bill Not Found" });
        return res.status(200).json({ message: "Purchase Bill Found", data: result });
    } catch (error) {
        next(error);
    }
}

export const getAllPurchaseBillController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getAllPurchaseBillService();
        return res.status(200).json({
            message: (result.length !== 0) ? "PurchaseBill's found" : "No Data Found",
            data: result
        })
    } catch (error) {
        next(error);
    }
}

export const updatePurchaseBillController = async (req: Request, res: Response, next: NextFunction) => {
    const purchaseBillId = req.params.id;
    if (!purchaseBillId) return res.status(400).json({ message: "Purchase Bill id is required" });

    const parsed = updatePurchaseBillPayloadSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error });

    const result = await updatePurchaseBillService(purchaseBillId, parsed.data);

    return res.status(200).json({ message: 'Data Updated', data: result });
}

export const deletPurchaseBillController = async (req: Request, res: Response, next: NextFunction) => {
    res.json("check working");
}