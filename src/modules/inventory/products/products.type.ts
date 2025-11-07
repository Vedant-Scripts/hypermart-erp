import type { Prisma } from "@prisma/client";
import type { batchUpdatePayload, CreateProductInput, UpdateProductPayload, variantUpdatePayload } from "./products.validation.js";

// this are for repo usage
export type ProductCreateInput = Prisma.ProductUncheckedCreateInput;
export type ProductUpdateInput = Prisma.ProductUpdateInput;
export type VariantUpdateInput = Prisma.VariantUpdateInput;
export type BatchUpdateInput = Prisma.BatchUpdateInput;

// For api payloads
export type CreateProductDTO = CreateProductInput;
export type UpdateProductDTO = UpdateProductPayload;
export type UpdateVariantDTO = variantUpdatePayload;
export type UpdateBatchDTO = batchUpdatePayload;


// Response DTOs