import { z } from "zod/v4";

export const createBrandSchema = z.object({
    name: z.string().trim().toUpperCase().min(1, { error: "Brand name is required" }),
    description: z.string().nullable(),
    isActive: z.boolean().default(true)
});

export const updateBrandSchema = createBrandSchema.partial();

export type CreateBrandInput = z.infer<typeof createBrandSchema>
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>