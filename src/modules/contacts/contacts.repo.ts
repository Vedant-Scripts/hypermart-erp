import type { ContactType } from "@prisma/client";
import prisma from "../../common/db.js";
import type { ContactCreateInput, ContactUpdateInput } from "./contacts.types.js";

export const createContactRepo = async (data: ContactCreateInput) => {
    return await prisma.contactManagement.create({ data });
};

export const updateContactRepo = async (contactId: string, data: ContactUpdateInput) => {
    return await prisma.contactManagement.update({
        where: { id: contactId },
        data: data
    });
};

export const getContactByIdRepo = async (contactId: string) => {
    return await prisma.contactManagement.findUnique({ where: { id: contactId } });
};

export const getContactByContactNumberRepo = async (contactNumber: string) => {

    return await prisma.contactManagement.findUnique({ where: { contactNumber: contactNumber }, select: { id: true } });
};

export const getAllContactsByContactTypeRepo = async (contactType: ContactType) => {
    return await prisma.contactManagement.findMany({ where: { type: contactType } });
};

export const deleteContactRepo = async (contactId: string) => {
    return await prisma.contactManagement.delete({ where: { id: contactId } });
};