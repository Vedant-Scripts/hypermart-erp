import type { NextFunction, Request, Response } from "express";
import { batchUpdatePayloadSchema, createProductPayloadSchema, updateProductPayloadSchema, variantUpdatePayloadSchema } from "./products.validation.js";
import { checkProductExistService, createProductService, generateBarcodeService, getAllProductsService, getProductByIdService, updateProductService } from "./products.service.js";


export const generateBarcodeController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await generateBarcodeService();
        return res.status(200).json({ message: 'Generated Barcode Number', barcodeNumber: result });
    } catch (error) {
        next(error)
    }
}

export const createProductController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // validate with zod
        const parsed = createProductPayloadSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ errors: parsed.error });

        // call service
        const product = await createProductService(parsed.data)

        return res.status(201).json({ message: 'Product Created', data: product })

    } catch (error) {
        next(error)
    }
}

export const getAllProductsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await getAllProductsService();
        return res.status(200).json({
            message: (products.length !== 0) ? 'Products found' : 'No Data Found',
            data: products
        })
    } catch (error) {
        next(error)
    }
}

export const getProductByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = req.params.id;
        if (!productId) return res.status(400).json({ message: "Product id is required" });
        const product = await getProductByIdService(productId);

        if (!product) return res.status(404).json({ message: "Product not found" });
        return res.status(200).json({ message: "Product found", data: product });
    } catch (error) {
        next(error)
    }
}

export const updateProductsByController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId, variantId, batchId } = req.query;
        const parsed = (productId)
            ? updateProductPayloadSchema.safeParse(req.body)
            : (variantId)
                ? variantUpdatePayloadSchema.safeParse(req.body)
                : batchUpdatePayloadSchema.safeParse(req.body)
        if (!parsed.success) return res.status(400).json({ message: "Invalid Inputs Sent" });
        const result = await updateProductService({
            productId: productId as string,
            variantId: variantId as string,
            batchId: batchId as string,
        }, parsed.data);

        return res.status(200).json({ message: 'Data Updated' });
    } catch (error) {

    }
}

export const checkProductExistController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { field, value } = req.query;
        if (!field || !value) return res.status(400).json({ message: "Field and Value are required" });
        if (typeof field !== 'string' || typeof value !== 'string') return res.status(400).json({ message: "Field and Value must be String" });

        const exists = await checkProductExistService(field, value);
        return res.status(200).json({ exists });
    } catch (error) {
        next(error)
    }
}

