import { Status } from "@prisma/client";
import { z } from "zod/v4";

export const createUnitSchema = z.object({
    unitName: z.string().trim().toUpperCase().min(1, { error: "Unit name is required" }),
    unitCode: z.string().trim().toUpperCase().min(1, { error: "Unit Code is required" }),
    status: z.enum(Status).default("ACTIVE")
});

export const updateUnitSchema = createUnitSchema.partial();

export type CreateUnitInput = z.infer<typeof createUnitSchema>
export type UpdateUnitInput = z.infer<typeof updateUnitSchema>