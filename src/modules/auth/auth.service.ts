import { decodeToken, signAccessToken, signRefreshToken, verifyToken } from "../../common/auth/index.js";
import config from "../../config/env.config.js";
import { comparePassword, hashPassword, hashToken } from "../../common/utils/password.js";
import { checkUserClientIdRepo, getUserByContactNumberRepo, getUserByEmailRepo, getUserByIdRepo, updateUserPasswordRepo } from "../users/users.repo.js";
import type { ChangePasswordReqType, ResetPasswordReqType, SignInReqType } from "./auth.validation.js";
import { PREFIXES, TOKEN_TYPES } from "../../common/utils/constant.js";
import { delRedisValue, getRedisValue, setRedisValue } from "../../common/integrations/redis.integration.js";
import type { Response } from "express";
import { generateOTP, sendOtpToMobile, storeOtpRedis, verifyOtpRedis } from "../../common/utils/otp.js";

export const sendOtpService = async (sendOtpInput: SignInReqType) => {

    const otp = generateOTP();

    await storeOtpRedis(sendOtpInput.authType, sendOtpInput.identifier, otp);     // Save OTP to Redis

    // Send Email to user using SMTP for now, later on change it to transactional AWS
    if (sendOtpInput.authType === 'mobile_otp') {
        await sendOtpToMobile(sendOtpInput.identifier, otp);
    } else {
        /** For now wait for AWS SNS */

        // try {
        //     await sendEmail({
        //         to: sendOtpInput.identifier,
        //         subject: "Your OTP for Ritanta Sign In",
        //         html: otpTemplate(otp),
        //         text: `Your OTP for Ritanta Sign In ${otp}`
        //     });
        // } catch (error) {
        //     await delRedisValue(`${sendOtpInput.authType}:${sendOtpInput.identifier}`);
        //     throw new Error('Something went wrong, email was not sent!');
        // }
    }

    return true;
}

export const signInService = async (signServiceInput: SignInReqType, client: { clientId: string, clientCode: string }) => {

    const user = (signServiceInput.authType === 'mobile_otp')
        ? await getUserByContactNumberRepo(signServiceInput.identifier)
        : await getUserByEmailRepo(signServiceInput.identifier);

    if (!user) throw new Error('Invalid credentials');

    if (user.status !== "ACTIVE") throw new Error("Account Inactive");

    const userClientPlatformCheck = await checkUserClientIdRepo(user.id, client.clientId);
    if (!userClientPlatformCheck) throw new Error('Account not allowed on this platform');


    if (client.clientCode === 'customer_app') {
        //mobile otp verify  
        // suggestion call verify Otp Service - there verify and create new user if it doesn't exist.
        if (!signServiceInput.otp) throw new Error("Please provide valid OTP");

        const result = await verifyOtpRedis(
            signServiceInput.authType,
            signServiceInput.identifier,
            signServiceInput.otp
        );

        if (!result.success) {
            const message = result.reason === "expired" ? "OTP has expired" : "Invalid OTP";
            throw new Error(message);
        }
    } else {
        if (!signServiceInput.password) throw new Error('Password is mandatory!');
        const isValid = await comparePassword(signServiceInput.password, user.password!);
        if (!isValid) throw new Error('Invalid Credentials');
    }

    const tokens = createTokens({ sub: user.id, aud: client.clientCode, role: user.role, authType: signServiceInput.authType });
    // save to redis
    await saveRefreshTokenRedis(Number(user.id), tokens.refreshToken);

    return tokens;
}

export const refreshTokenService = async (token: string, client: { clientId: string, clientCode: string }) => {
    const decoded = decodeToken(token)
    if (!decoded || typeof decoded === 'string') throw new Error("Invalid token: cannot decode");

    const { sub: userId, aud, role, tokenType, authType } = decoded;
    if (tokenType !== TOKEN_TYPES.REFRESH) throw new Error('Invalid token type');

    if (client.clientCode !== aud) throw new Error('Refresh token audience mismatch / account not allowed on this platform');

    if (!userId) throw new Error('No userId found in refresh Token');
    const user = await getUserByIdRepo(userId);

    if (!user) throw new Error('User Not Found');
    if (user.status !== "ACTIVE") throw new Error("Account Inactive");

    const userClientPlatformCheck = await checkUserClientIdRepo(user.id, client.clientId);
    if (!userClientPlatformCheck) throw new Error('Account not allowed on this platform');

    const redisKey = `${PREFIXES.REFRESH_TOKEN}:${Number(userId)}`;
    const storedToken = await getRedisValue(redisKey);
    if (!storedToken) throw new Error('No active refresh session found (may have expired or logged out)');
    if (storedToken !== hashToken(token)) throw new Error('Refresh token mismatch — possibly replaced');

    try {
        verifyToken(token, config.jwt.refreshSecret);
    } catch (error) {
        throw new Error('Invalid or expired refresh token')
    }

    const tokens = createTokens({ sub: userId, aud: aud, role, authType })
    // save to redis 
    await saveRefreshTokenRedis(Number(userId), tokens.refreshToken);
    return tokens;
}

export const forgotPasswordService = async () => {

}

export const changePasswordService = async (changePasswordInput: ChangePasswordReqType, userId: string) => {
    const user = await getUserByIdRepo(userId);
    if (!user) throw new Error('Invalid Credentials');
    const isValid = await comparePassword(changePasswordInput.oldPassword, user.password!);
    if (!isValid) throw new Error('Old password did not match');

    if (await comparePassword(changePasswordInput.newPassword, user.password!)) {
        throw new Error('New password must be different from the old password');
    }

    const newHashPassword = await hashPassword(changePasswordInput.newPassword);

    await updateUserPasswordRepo(userId, newHashPassword);

    return { success: true };
}

export const resetPasswordService = async (resetPasswordInput: ResetPasswordReqType, userId: string) => {
    const user = await getUserByIdRepo(userId);
    if (!user) throw new Error('Invalid Credentials');

    if (await comparePassword(resetPasswordInput.newPassword, user.password!)) {
        throw new Error('New password must be different from the old password');
    }

    const newHashPassword = await hashPassword(resetPasswordInput.newPassword);

    await updateUserPasswordRepo(userId, newHashPassword);

    return { success: true };
}

export const setCookieService = (res: Response, refreshToken: string, csrfToken: string) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,       // for https
        sameSite: "none",
        path: "/api/auth/refresh-token",
        maxAge: config.jwt.refreshExpiresIn
    });
    res.cookie("csrfToken", csrfToken, {
        httpOnly: false,
        secure: true,       // for https
        sameSite: "none",
        path: '/',
        maxAge: config.jwt.refreshExpiresIn
    });
}

// helpers 
const createTokens = (payload: object) => ({
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    accessTokenExpiresIn: config.jwt.expiresIn,
    refreshTokenExpiresIn: config.jwt.refreshExpiresIn

})

const saveRefreshTokenRedis = async (userId: number, refreshToken: string) => {
    const key = `${PREFIXES.REFRESH_TOKEN}:${userId}`;
    const value = hashToken(refreshToken);
    return await setRedisValue(key, config.jwt.refreshExpiresIn, value);       // store refresh-token in redis
}