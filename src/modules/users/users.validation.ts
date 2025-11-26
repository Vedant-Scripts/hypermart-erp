import { Gender, Role, Shift, Status } from "../../generated/prisma/client.js";
import { z } from "zod";

const EmployeeProfileSchema = z.object({
    dateOfBirth: z.iso.datetime().nullable(),
    joiningDate: z.iso.datetime().nullable(),
    shift: z.enum(Shift),
    emergencyContactName: z.string().nullable(),
    emergencyContactRelation: z.string().nullable(),
    emergencyContactNumber: z.string().regex(/^[6-9][0-9]{9}$/, "Invalid Contact Number").nullable(),
    bankName: z.string().nullable(),
    bankAccountNumber: z.string().nullable(),
    bankIfscCode: z.string().nullable(),
    bankBranch: z.string().nullable()
});

const AddressSchema = z.object({
    label: z.string().nullable(),
    line1: z.string().nullable(),
    line2: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    country: z.string().nullable(),
    pincode: z.string().nullable(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    isDefault: z.boolean().nullable()
});

export const UserPayloadSchema = z.object({
    role: z.enum(Role),
    firstName: z.string().min(1),
    lastName: z.string().nullable(),
    email: z.email(),
    contactNumber: z.string().regex(/^[6-9][0-9]{9}$/, "Invalid Contact Number").nullable(),
    gender: z.enum(Gender),
    password: z.string().min(6), // accept nullable if OAuth/OTP
    status: z.enum(Status).default('ACTIVE'),
    employeeProfile: EmployeeProfileSchema.nullable(),
    addresses: z.array(AddressSchema).nullable()
});

export const updateUserPayloadSchema = UserPayloadSchema.partial();

export type CreateUserType = z.infer<typeof UserPayloadSchema>;
export type AddressPayloadType = z.infer<typeof AddressSchema>;
export type EmployeeProfilePayloadType = z.infer<typeof EmployeeProfileSchema>;
export type UpdateUserType = z.infer<typeof updateUserPayloadSchema>;