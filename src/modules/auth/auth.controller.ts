import type { Request, Response, NextFunction } from "express";
import { changePasswordSchema, forgotPasswordSchema, resetPasswordSchema, signInSchema, type ChangePasswordReqType, type ResetPasswordReqType, type SignInReqType } from "./auth.validation.js";
import { changePasswordService, refreshTokenService, resetPasswordService, sendOtpService, setCookieService, signInService } from "./auth.service.js";
import { csrfTokenGenerate } from "../../common/utils/password.js";

export const sendOtpController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { clientCode } = res.locals.client;
        if (clientCode !== 'customer_app') return res.status(403).json({ message: "Forbidden Request" });
        
        const parsed = signInSchema.safeParse(req.body);
        if (!parsed.success) {
            // validation failed
            return res.status(400).json({ errors: parsed.error });
        }
        const sendOtpInput = parsed.data as SignInReqType;
        if (sendOtpInput.authType === 'email_password') return res.status(400).json({ message: "Auth type is invalid" });

        await sendOtpService(sendOtpInput);

        res.json({ message: "OTP sent" });
    } catch (error) {
        next(error)
    }
}


export const signInController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = signInSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ errors: parsed.error });

        const signServiceInput = parsed.data as SignInReqType;
        const result = await signInService(signServiceInput, res.locals.client);

        const { clientCode } = res.locals.client;

        if (clientCode === 'erp_web') {
            // response for the web apps
            const csrfToken = csrfTokenGenerate();
            setCookieService(res, result.refreshToken, csrfToken);
            return res.status(200).json({
                message: 'Login Successfull',
                data: {
                    accessToken: result.accessToken,
                    accessTokenExpiresIn: result.accessTokenExpiresIn
                },
            });
        }
        // below response is for the mobile apps
        res.status(200).json({
            message: 'Login Successfull',
            data: {
                accessToken: result.accessToken,
                accessTokenExpiresIn: result.accessTokenExpiresIn,
                refreshToken: result.refreshToken,
                refreshTokenExpiresIn: result.refreshTokenExpiresIn
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

        const result = await refreshTokenService(refreshToken, res.locals.client);

        const { clientCode } = res.locals.client;

        if (clientCode === 'erp_web') {
            // response for the web apps
            const csrfToken = csrfTokenGenerate();
            setCookieService(res, result.refreshToken, csrfToken);
            return res.status(200).json({
                message: 'Token refreshed Successfully',
                data: {
                    accessToken: result.accessToken,
                    accessTokenExpiresIn: result.accessTokenExpiresIn
                }
            });
        }
        // below response is for the mobile apps
        res.status(200).json({
            message: 'Token refreshed Successfully',
            data: {
                accessToken: result.accessToken,
                accessTokenExpiresIn: result.accessTokenExpiresIn,
                refreshToken: result.refreshToken,
                refreshTokenExpiresIn: result.refreshTokenExpiresIn
            }
        });
    } catch (error) {
        next(error);
    }

}

export const forgotPasswordController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { clientCode } = res.locals.client;
        if (clientCode !== 'erp_web') return res.status(403).json({ message: "Forbidden Request" });

        const parsed = forgotPasswordSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ errors: parsed.error });
        }
        // const dto:string = parsed.data;
        // need to do it with aws email
    } catch (error) {

    }
}

export const changePasswordController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { clientCode } = res.locals.client;
        if (clientCode !== 'erp_web') return res.status(403).json({ message: "Forbidden Request" });
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

export const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { clientCode } = res.locals.client;
        if (clientCode !== 'erp_web') return res.status(403).json({ message: "Forbidden Request" });
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
