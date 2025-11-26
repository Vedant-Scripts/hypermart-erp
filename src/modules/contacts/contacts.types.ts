import type { ContactType, Prisma, Status } from "../../generated/prisma/client.js";
import type { CreateContactInput, UpdateContactInput } from "./contacts.validation.js";

// this for repo usage
export type ContactCreateInput = Prisma.ContactManagementCreateInput;
export type ContactUpdateInput = Prisma.ContactManagementCreateInput;


// for api payloads

export type createContactDTO = CreateContactInput;
export type updateContactDTO = UpdateContactInput;

//Response DTOs

export type ContactResponseDTO = {
    id: string;
    type: ContactType;
    name?: string | null;
    email?: string | null;
    contactNumber?: string | null;
    companyName?: string | null;
    gstin?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    pincode?: number | null;

    bankName?: string | null;
    branchName?: string | null;
    ifscCode?: string | null;
    accountName?: string | null;

    status: Status;
    createdAt: Date;
    updatedAt: Date;

}