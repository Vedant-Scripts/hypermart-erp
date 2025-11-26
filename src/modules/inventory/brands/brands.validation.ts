import { z } from "zod/v4";
import { Status } from "../../../generated/prisma/client.js";

export const createBrandSchema = z.object({
    name: z.string().trim().toUpperCase().min(1, { error: "Brand name is required" }),
    description: z.string().nullable(),
    status: z.enum(Status).default("ACTIVE")
});

export const updateBrandSchema = createBrandSchema.partial();

export type CreateBrandInput = z.infer<typeof createBrandSchema>
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>