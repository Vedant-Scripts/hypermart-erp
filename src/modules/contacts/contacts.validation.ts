import { ContactType, Status } from "@prisma/client";
import { z } from "zod";

export const createContactSchema = z.object({
    type: z.enum(ContactType),
    name: z.string().min(1).nullable(),
    email: z.email().nullable(),
    contactNumber: z.string().regex(/^[6-9][0-9]{9}$/, "Invalid Contact Number").nullable(),
    companyName: z.string().nullable(),
    gstin: z.string().nullable(),
    address: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    country: z.string().nullable(),
    pincode: z.number().int().gte(100000).lte(999999).nullable(),
    bankName: z.string().nullable(),
    branchName: z.string().nullable(),
    ifscCode: z.string().nullable(),
    accountName: z.string().nullable(),
    status: z.enum(Status).default("ACTIVE")
});


export const updateContactSchema = createContactSchema.partial();

export type CreateContactInput = z.infer<typeof createContactSchema>
export type UpdateContactInput = z.infer<typeof updateContactSchema>