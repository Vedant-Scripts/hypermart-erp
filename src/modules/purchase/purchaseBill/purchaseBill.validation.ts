import { FlatDiscountType, PaymentStatus } from "@prisma/client";
import z from "zod";

const batchSchema = z.object({
    productId: z.string().nullable(),
    variantId: z.string().nullable(),
    mfgDate: z.iso.datetime().nullable(),
    expDate: z.iso.datetime().nullable(),
    expDays: z.number().nonnegative().nullable(),
    purchasePrice: z.number().nonnegative(),
    landingCost: z.number().nonnegative(),
    mrp: z.number().nonnegative(),
    sellingDiscount: z.number().nonnegative(),
    sellingPrice: z.number().nonnegative(),
    sellingMargin: z.number().nonnegative(),
    availableQty: z.number().int().nonnegative(),
}).refine(
    (data) =>
        (data.productId !== null && data.variantId === null) ||
        (data.productId === null && data.variantId !== null),
    {
        error: 'Either productId or variantId must be provided'
    }
);

const batchUpdateSchema = batchSchema.partial().safeExtend({
    id: z.string().optional(),
});
export const createPurchaseBillPayloadSchema = z.object({
    supplierId: z.string().min(1, "Supplier ID is required"),
    purchaseBillDate: z.iso.datetime(), // allows date string and converts to Date
    paymentStatus: z.enum(PaymentStatus),
    flatDiscountType: z.enum(FlatDiscountType),
    flatDiscount: z.number().nonnegative(),
    grossDiscount: z.number().nonnegative(),
    discount: z.number().nonnegative(),
    taxableAmount: z.number().nonnegative(),
    tax: z.number().nonnegative(),
    roundOff: z.number(),
    netAmount: z.number().nonnegative(),
    products: z.array(batchSchema)
});

export const updatePurchaseBillPayloadSchema = createPurchaseBillPayloadSchema.extend({
    products: z.array(batchUpdateSchema)
}).partial();

export type CreatePurchaseBillPayloadType = z.infer<typeof createPurchaseBillPayloadSchema>;
export type UpdatePurchaseBillPayloadType = z.infer<typeof updatePurchaseBillPayloadSchema>;