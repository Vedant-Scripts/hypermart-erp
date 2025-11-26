import type { Prisma } from "../../../generated/prisma/client.js";
import type {  CreateSubcategoryInput, UpdateSubcategoryInput } from "./subcategories.validation.js";

// this are for repo usage
export type SubcategoryCreateInput = Prisma.SubcategoryCreateInput;
export type SubcategoryUpdateInput = Prisma.SubcategoryUpdateInput;


// For api payloads
export type CreateSubcategoryDTO = CreateSubcategoryInput;

export type updateSubcategoryDTO = UpdateSubcategoryInput;


// Response DTOs
export type SubcategoryResponseDTO = {
    id: string;
    categoryId: string;
    categoryName: string;
    name: string;
    description?: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
