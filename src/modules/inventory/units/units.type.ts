import type { Prisma } from "@prisma/client";
import type { CreateUnitInput, UpdateUnitInput } from "./units.validation.js";

// this are for repo usage
export type UnitCreateInput = Prisma.UnitCreateInput;
export type UnitUpdateInput = Prisma.UnitUpdateInput;


// For api payloads
export type CreateUnitDTO = CreateUnitInput;

export type updateUnitDTO = UpdateUnitInput;


// Response DTOs
export type UnitResponseDTO = {
    id: number;
    unitName: string;
    unitCode: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
