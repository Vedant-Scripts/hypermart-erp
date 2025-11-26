import type { Gender, Prisma, Role, Status } from "../../generated/prisma/client.js";
import type { CreateUserType, UpdateUserType } from "./users.validation.js";

// this for repo usage
export type UserCreateInput = Prisma.UserCreateInput;
export type UserUpdateInput = Prisma.UserUpdateInput;


// for api payloads

export type createUserDTO = CreateUserType;
export type updateUserDTO = UpdateUserType;

//Response DTOs

export type AddressDTO = {
    id: string;
    label?: string | null;
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    pincode?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type EmployeeProfileDTO = {
    id: string;
    dateOfBirth?: Date | null;
    joiningDate?: Date | null;
    shift?: string | null;
    emergencyContactName?: string | null;
    emergencyContactRelation?: string | null;
    emergencyContactNumber?: string | null;
    bankName?: string | null;
    bankAccountNumber?: string | null;
    bankIfscCode?: string | null;
    bankBranch?: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export type UserResponseDTO = {
    id: string;

    // Core identity
    role: Role;
    firstName: string;
    lastName?: string | null;
    email?: string | null;
    contactNumber?: string | null;
    gender?: Gender | null;

    // Status & audit
    status: Status;
    createdAt: Date;
    updatedAt: Date;

    // Relations
    employeeProfile?: EmployeeProfileDTO | null;
    addresses?: AddressDTO[];
};