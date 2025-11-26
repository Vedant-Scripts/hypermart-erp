import { Status } from "../../../generated/prisma/client.js";
import { z } from "zod/v4";

export const subcategorySchema = z.object({
    categoryId: z.string().min(1),
    name: z.string().trim().toUpperCase().min(1, { error: "Subcategory name is required" }),
    description: z.string().nullable(),
    status: z.enum(Status).default("ACTIVE")
});

export const updateSubcategorySchema = subcategorySchema.partial();

export type CreateSubcategoryInput = z.infer<typeof subcategorySchema>
export type UpdateSubcategoryInput = z.infer<typeof updateSubcategorySchema>