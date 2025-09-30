import z from "zod";

export const signInSchema = z.object({
    authType:z.enum(['email', 'mobile']),
    clientType:z.enum(['erpUser', 'mobileUser']),
    identifier: z.string(),
    password: z.string().min(1)
});

export const forgotPasswordSchema = z.object({
    email: z.email()
});

export const changePasswordSchema = z.object({
    oldPassword: z.string(),
    newPassword: z.string().min(6, "Password must be at least 6 characters")
})

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(6, "Password must be at least 6 characters")
})


export type SignInReqType = z.infer<typeof signInSchema>
export type ChangePasswordReqType = z.infer<typeof changePasswordSchema>
export type ResetPasswordReqType = z.infer<typeof resetPasswordSchema>