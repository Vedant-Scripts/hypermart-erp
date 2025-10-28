import z from "zod";
import { AUTH_TYPES } from "../../common/utils/constant.js";

export const signInSchema = z.object({
    authType:z.enum(AUTH_TYPES),
    identifier: z.string().min(1),
    password: z.string().min(1).optional(),
    otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits").optional()
});

export const forgotPasswordSchema = z.object({
    email: z.email()
});

export const changePasswordSchema = z.object({
    oldPassword: z.string().min(1),
    newPassword: z.string().min(6, "Password must be at least 6 characters")
})

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(6, "Password must be at least 6 characters")
})


export type SignInReqType = z.infer<typeof signInSchema>
export type ChangePasswordReqType = z.infer<typeof changePasswordSchema>
export type ResetPasswordReqType = z.infer<typeof resetPasswordSchema>