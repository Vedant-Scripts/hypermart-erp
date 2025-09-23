import { decodeToken, signAccessToken, signRefreshToken, verifyToken } from "../../common/auth/index.js";
import config from "../../config/env.config.js";
import { comparePassword, hashPassword, hashToken } from "../../utils/password.js";
import { findUserByEmail, findUserById, updateUserPassword } from "../users/users.repo.js";
import type { ChangePasswordReqType, ResetPasswordReqType, SignInReqType } from "./auth.validation.js";
import { PREFIXES, TOKEN_TYPES } from "../../common/constant.js";
import { getRedisValue, setRedisValue } from "../../common/integrations/redis.integration.js";
import type { Response } from "express";

export const signInService = async (signServiceInput: SignInReqType) => {
    const user = await findUserByEmail(signServiceInput.identifier);
    if (!user) throw new Error('Invalid Credentials');

    const isValid = await comparePassword(signServiceInput.password, user.password);
    if (!isValid) throw new Error('Invalid Credentials');

    const tokens = createTokens({ sub: user.id, role: user.role, authType: signServiceInput.authType, clientType: signServiceInput.clientType });
    // save to redis
    await saveRefreshTokenRedis(Number(user.id), tokens.refreshToken);

    return tokens;
}

export const refreshTokenService = async (token: string) => {
    const decoded = decodeToken(token)
    if (!decoded || typeof decoded === 'string') throw new Error("Invalid token: cannot decode");
    const { sub: userId, role, tokenType, authType, clientType } = decoded;
    if (tokenType !== TOKEN_TYPES.REFRESH) throw new Error('Invalid token type');

    const redisKey = `${PREFIXES.REFRESH_TOKEN}:${Number(userId)}`;
    const storedToken = await getRedisValue(redisKey);
    if (!storedToken) throw new Error('No active refresh session found (may have expired or logged out)');
    if (storedToken !== hashToken(token)) throw new Error('Refresh token mismatch — possibly replaced');

    try {
        verifyToken(token, config.jwt.refreshSecret);
    } catch (error) {
        throw new Error('Invalid or expired refresh token')
    }

    const tokens = createTokens({ sub: userId, role, authType, clientType })
    // save to redis 
    await saveRefreshTokenRedis(Number(userId), tokens.refreshToken);
    return tokens;
}

export const forgotPasswordService = async () => {

}

export const changePasswordService = async (changePasswordInput: ChangePasswordReqType, userId: number) => {
    const user = await findUserById(userId);
    if (!user) throw new Error('Invalid Credentials');

    const isValid = await comparePassword(changePasswordInput.oldPassword, user.password);
    if (!isValid) throw new Error('Old password did not match');

    if (await comparePassword(changePasswordInput.newPassword, user.password)) {
        throw new Error('New password must be different from the old password');
    }

    const newHashPassword = await hashPassword(changePasswordInput.newPassword);

    await updateUserPassword(userId, newHashPassword);

    return { success: true };
}

export const resetPasswordService = async (resetPasswordInput: ResetPasswordReqType, userId: number) => {
    const user = await findUserById(userId);
    if (!user) throw new Error('Invalid Credentials');

    if (await comparePassword(resetPasswordInput.newPassword, user.password)) {
        throw new Error('New password must be different from the old password');
    }

    const newHashPassword = await hashPassword(resetPasswordInput.newPassword);

    await updateUserPassword(userId, newHashPassword);

    return { success: true };
}

export const setCookieService = (res: Response, refreshToken: string, csrfToken: string) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,    
        secure: false,       // for https
        sameSite: "lax",
        path: "/api/auth/refresh-token",
        maxAge: config.jwt.refreshExpiresIn
    });
    res.cookie("csrfToken", csrfToken, {
        httpOnly: false,    
        secure: false,       // for https
        sameSite: "lax",
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