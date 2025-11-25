import type { Prisma } from "../../../generated/prisma/client.js";
import type { CreateBrandInput, UpdateBrandInput } from "./brands.validation.js";

// this are for repo usage
export type BrandCreateInput = Prisma.BrandCreateInput;
export type BrandUpdateInput = Prisma.BrandUpdateInput;


// For api payloads
export type CreateBrandDTO = CreateBrandInput;

export type updateBrandDTO = UpdateBrandInput;


// Response DTOs
export type BrandResponseDTO = {
    id: string;
    name: string;
    description?: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
