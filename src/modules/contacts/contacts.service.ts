import type { ContactType } from "@prisma/client";
import { pickDefined } from "../../common/utils/pickDefined.js";
import { createContactRepo, deleteContactRepo, getAllContactsByContactTypeRepo, getContactByIdRepo, getContactByContactNumberRepo, updateContactRepo } from "./contacts.repo.js";
import type { ContactUpdateInput, createContactDTO, updateContactDTO } from "./contacts.types.js";

export const createContactService = async (data: createContactDTO) => {
    if (data.contactNumber) {
        const checkMobileUniquenes = await getContactByContactNumberRepo(data.contactNumber);
        if (checkMobileUniquenes) throw new Error("Mobile No already exists");
    }

    return await createContactRepo(data);
}


export const updateContactService = async (contactId: string, data: updateContactDTO) => {
    const existing = await getContactByIdRepo(contactId);
    if (!existing) throw new Error('Contact Not Found');

    if (data.contactNumber) {
        const checkMobileUniquenes = await getContactByContactNumberRepo(data.contactNumber);
        if (checkMobileUniquenes && checkMobileUniquenes.id !== contactId) throw new Error('Mobile No already Exists')
    }

    const prismaData = pickDefined(data) as ContactUpdateInput;

    return await updateContactRepo(contactId, prismaData);
}

export const getContactByIdService = async (contactId: string) => {
    return await getContactByIdRepo(contactId);
}

export const getAllContactsByContactTypeService = async (contactType: ContactType) => {
    return await getAllContactsByContactTypeRepo(contactType);
}

export const checkContactContactNumberService = async (contactNumber: string) => {
    const count = await getContactByContactNumberRepo(contactNumber);
    return !!count;
}

export const deleteContactService = async (contactId: string) => {

    const existing = await getContactByIdRepo(contactId);
    if (!existing) throw new Error('Contact Not Found');

    return await deleteContactRepo(contactId);
}