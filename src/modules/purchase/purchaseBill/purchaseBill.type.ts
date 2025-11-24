import type { Prisma } from "../../../generated/prisma/client.js";
import type { CreatePurchaseBillPayloadType, UpdatePurchaseBillPayloadType } from "./purchaseBill.validation.js";

// this for repo usage
export type PurchaseBillCreateInput = Prisma.PurchaseBillUncheckedCreateInput;
export type PurchaseBillUpdateInput = Prisma.PurchaseBillUpdateInput;

// for api payloads 
export type CreatePurchaseBillDTO = CreatePurchaseBillPayloadType;
export type updatePurchaseBillDTO = UpdatePurchaseBillPayloadType;