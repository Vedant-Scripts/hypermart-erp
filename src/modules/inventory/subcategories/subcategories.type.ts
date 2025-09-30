import type { Prisma } from "@prisma/client";
import type {  CreateSubcategoryInput, UpdateSubcategoryInput } from "./subcategories.validation.js";

// this are for repo usage
export type SubcategoryCreateInput = Prisma.SubCategoryCreateInput;
export type SubcategoryUpdateInput = Prisma.SubCategoryUpdateInput;


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
