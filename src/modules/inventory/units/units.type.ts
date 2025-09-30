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
    id: string;
    unitName: string;
    unitCode: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
