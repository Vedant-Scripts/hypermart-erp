import { z } from "zod/v4";

export const categorySchema = z.object({
    name: z.string().trim().toUpperCase().min(1, { error: "Category name is required" }),
    description: z.string().nullable(),
    isActive: z.boolean().default(true)
});

export const updateCategorySchema = categorySchema.partial();

export type CreateCategoryInput = z.infer<typeof categorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>