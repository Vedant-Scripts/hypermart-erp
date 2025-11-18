import type { Prisma } from "@prisma/client";
import { pickDefined } from "../../../common/utils/pickDefined.utils.js";
import { checkContactFieldExistRepo } from "../../contacts/contacts.repo.js";
import { checkBatchCountsRepo, checkFieldsInItemCodeRegistryRepo, deleteProductTransactionRepo } from "../../inventory/products/products.repo.js";
import { createPurchaseBillTransactionRepo, getAllPurchaseBillRepo, getPurchaseBillByIdRepo, updatePurchaseBillTransactionRepo } from "./purchaseBill.repo.js";
import type { CreatePurchaseBillDTO, updatePurchaseBillDTO } from "./purchaseBill.type.js";

export const createPurchaseBillService = async (data: CreatePurchaseBillDTO) => {
    const checkSupplier = await checkContactFieldExistRepo('id', data.supplierId, ['id']);
    if (!checkSupplier) throw new Error("supplier not found");

    let pIds: string[] = [];
    let vIds: string[] = [];
    for (const p of data.batches) {
        if (p.productId) {
            pIds.push(p.productId);
        } else {
            vIds.push(p.variantId!);
        }
    }
    const checkPIds = await checkFieldsInItemCodeRegistryRepo('PRODUCT', 'entityId', pIds);
    if (checkPIds !== pIds.length) throw new Error('One or more Product IDs do not exist');

    const checkVIds = await checkFieldsInItemCodeRegistryRepo('VARIANT', 'entityId', vIds);
    if (checkVIds !== vIds.length) throw new Error('One or more Variant IDs do not exist');

    return createPurchaseBillTransactionRepo(data);
}

export const getPurchaseBillByIdService = (purchaseBillById: string) => {
    return getPurchaseBillByIdRepo(purchaseBillById);
}

export const getAllPurchaseBillService = async () => {
    const data = await getAllPurchaseBillRepo();
    const result = data.map(({ supplier, ...rest }) => ({
        ...rest,
        supplierName: supplier.name
    }));
    return result;
}

export const updatePurchaseBillService = async (purchaseBillById: string, data: updatePurchaseBillDTO) => {
    // check existance of the supplier if it is passed
    if (data.supplierId) {
        const checkSupplier = await checkContactFieldExistRepo('id', data.supplierId, ['id']);
        if (!checkSupplier) throw new Error("supplier not found");
    }

    if (data.batches && data.batches.length !== 0) {
        let bIds: string[] = [];
        let pIds: string[] = [];
        let vIds: string[] = [];
        for (const p of data.batches) {
            if (!p.productId && !p.variantId && !p.id) continue;
            if (p.id) {
                bIds.push(p.id);
            }
            if (p.productId) {
                pIds.push(p.productId);
            } else if (p.variantId) {
                vIds.push(p.variantId!);
            }
        }

        const checkBIds = await checkBatchCountsRepo(bIds);
        if (checkBIds !== bIds.length) throw new Error('One or more Batch IDs do not exist')

        if (pIds.length !== 0) {
            const checkPIds = await checkFieldsInItemCodeRegistryRepo('PRODUCT', 'entityId', pIds);
            if (checkPIds !== pIds.length) throw new Error('One or more Product IDs do not exist');
        }

        if (vIds.length !== 0) {
            const checkVIds = await checkFieldsInItemCodeRegistryRepo('VARIANT', 'entityId', vIds);
            if (checkVIds !== vIds.length) throw new Error('One or more Variant IDs do not exist');
        }
    }
    return updatePurchaseBillTransactionRepo(purchaseBillById, data);
}

export const deletePurchaseBillService = (purchaseBillById: string) => {
    return deleteProductTransactionRepo(purchaseBillById);
}
