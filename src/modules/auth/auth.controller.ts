import type { Request, Response, NextFunction } from "express";
import { changePasswordSchema, forgotPasswordSchema, resetPasswordSchema, signInSchema, type ChangePasswordReqType, type ResetPasswordReqType, type SignInReqType } from "./auth.validation.js";
import { changePasswordService, refreshTokenService, resetPasswordService, setCookieService, signInService } from "./auth.service.js";
import { csrfTokenGenerate } from "../../utils/password.js";

export const signInController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = signInSchema.safeParse(req.body);
        if (!parsed.success) {
            // validation failed
            return res.status(400).json({ errors: parsed.error });
        }
        const signServiceInput: SignInReqType = parsed.data;
        const result = await signInService(signServiceInput);
        const csrfToken = csrfTokenGenerate();
        setCookieService(res, result.refreshToken, csrfToken);
        res.status(200).json({
            message: 'Login Successfull',
            data: {
                accessToken: result.accessToken,
                accessTokenExpiresIn: result.accessTokenExpiresIn
            },
        });
    } catch (error) {
        next(error);
    }
};

export const refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const csrfHeader = req.get('x-csrf-token');
        const csrfCookie = req.cookies.csrfToken;
        if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
            return res.status(403).json({ message: 'CSRF token mismatch' });
        }
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ error: "Missing refresh token" });
        const result = await refreshTokenService(refreshToken);
        const csrfToken = csrfTokenGenerate();
        setCookieService(res, result.refreshToken, csrfToken);
        res.status(200).json({
            message: 'Token refreshed Successfully',
            data: {
                accessToken: result.accessToken,
                accessTokenExpiresIn: result.accessTokenExpiresIn
            }
        });
    } catch (error) {
        next(error);
    }

}

export const forgotPasswordController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = forgotPasswordSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ errors: parsed.error });
        }
        // const dto:string = parsed.data;
        // need to do it with aws email
    } catch (error) {

    }
}

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { sub: userId } = res.locals.user;
        const parsed = changePasswordSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ errors: parsed.error });
        }
        const changePasswordInput: ChangePasswordReqType = parsed.data;
        await changePasswordService(changePasswordInput, userId);
        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        next(error);
    }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { sub: userId } = res.locals.user;
        const parsed = resetPasswordSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ errors: parsed.error });
        }
        const resetPasswordInput: ResetPasswordReqType = parsed.data;
        await resetPasswordService(resetPasswordInput, userId);
        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        next(error);
    }
}
