import type { Prisma, User, EmployeeProfile } from "../../generated/prisma/client.js";


export type UserWithProfile = Prisma.UserGetPayload<{
    include: { employeeProfile: true };
}>;

export type UserPublic = Omit<UserWithProfile, "password"> & {
    createdAt: Date;
    updatedAt: Date;
    employeeProfile?: (EmployeeProfile & {

    }) | null;
};

// export type SignInReq = {
//     identifier: string; // email | contactNumber
//     password: string;
// };



export type TokenPair = {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: number;
    refreshTokenExpiresIn: number;
};

export type ForgotPasswordReq = { email?: string; contactNumber?: string };
export type ResetPasswordReq = { token: string; newPassword: string };

// Service return types
export type SignInRes = { tokens: TokenPair };
export type RefreshRes = TokenPair;
