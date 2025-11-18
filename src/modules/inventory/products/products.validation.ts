import { ProductType } from "@prisma/client";
import { z } from "zod/v4";

export const batchPayloadSchema = z.object({
    mfgDate: z.iso.datetime().nullable(),
    expDate: z.iso.datetime().nullable(),
    expDays: z.number().nonnegative().nullable(),
    purchasePrice: z.number().nonnegative(),
    landingCost: z.number().nonnegative(),
    mrp: z.number().nonnegative(),
    sellingDiscount: z.number().nonnegative(),
    sellingPrice: z.number().nonnegative(),
    sellingMargin: z.number().nonnegative(),
    availableQty: z.number().int().nonnegative().default(0),
    supplierId: z.string().nullable(),
    purchaseBillId: z.string().nullable(),
});

export const variantPayloadSchema = z.object({
    itemCode: z.string().min(1),
    variantName: z.string().min(1),
    batch: z.array(batchPayloadSchema).nullable(),
});


export const createProductPayloadSchema = z.object({
    itemCode: z.string().nullable(),
    productName: z.string().min(1),
    printName: z.string(),

    productType: z.enum(ProductType),

    categoryId: z.string().min(1),
    subcategoryId: z.string().nullable(),
    brandId: z.string().min(1),
    unitId: z.string().min(1),
    hsnCode: z.string().nullable(),

    purchaseTax: z.string(),
    salesTax: z.string(),
    purchaseTaxIncluding: z.boolean().default(false),
    salesTaxIncluding: z.boolean().default(true),

    hasExpiry: z.boolean().default(true),

    description: z.string().trim().nullable(),
    shortDesc: z.string().trim().nullable(),
    // optional product-level batches (for SINGLE product or product-level default)
    batch: z.array(batchPayloadSchema).nullable(),

    // optional variants (for VARIANT product)
    variants: z.array(variantPayloadSchema).nullable(),
});

// update schema's 
export const updateProductPayloadSchema = createProductPayloadSchema.omit({
    productType: true,
    hasExpiry: true,
    batch: true,
    variants: true
}).partial();

export const batchUpdatePayloadSchema = z.object({
    landingCost: z.number().nonnegative(),
    purchasePrice: z.number().nonnegative(),
    mrp: z.number().nonnegative(),
    sellingPrice: z.number().nonnegative(),
    sellingDiscount: z.number().nonnegative(),
    sellingMargin: z.number().nonnegative()
}).partial();

export const variantUpdatePayloadSchema = variantPayloadSchema.omit({ batch: true }).partial();


export type BatchPayload = z.infer<typeof batchPayloadSchema>;
export type VariantPayload = z.infer<typeof variantPayloadSchema>;
export type CreateProductInput = z.infer<typeof createProductPayloadSchema>;

export type UpdateProductPayload = z.infer<typeof updateProductPayloadSchema>;
export type batchUpdatePayload = z.infer<typeof batchUpdatePayloadSchema>;
export type variantUpdatePayload = z.infer<typeof variantUpdatePayloadSchema>;