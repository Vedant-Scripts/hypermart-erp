import type { Prisma } from "@prisma/client";
import type {  CreateCategoryInput, UpdateCategoryInput } from "./categories.validation.js";

// this are for repo usage
export type CategoryCreateInput = Prisma.CategoryCreateInput;
export type CategoryUpdateInput = Prisma.CategoryUpdateInput;


// For api payloads
export type CreateCategoryDTO = CreateCategoryInput;

export type updateCategoryDTO = UpdateCategoryInput;


// Response DTOs
export type CategoryResponseDTO = {
    id: string;
    name: string;
    description?: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
