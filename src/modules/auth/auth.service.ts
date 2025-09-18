import { decodeToken, signAccessToken, signRefreshToken, verifyToken } from "../../common/auth/index.js";
import config from "../../config/env.config.js";
import { comparePassword, hashPassword } from "../../utils/password.js";
import { findUserByEmail, findUserById, updateUserPassword } from "../users/users.repo.js";
import type { ChangePasswordReqType, ResetPasswordReqType, SignInReqType } from "./auth.validation.js";
import { TOKEN_TYPES } from "../../common/constant.js";

export const signInService = async (signServiceInput: SignInReqType) => {
    const user = await findUserByEmail(signServiceInput.identifier);
    if (!user) throw new Error('Invalid Credentials');

    const isValid = await comparePassword(signServiceInput.password, user.password);
    if (!isValid) throw new Error('Invalid Credentials');

    const tokens = createTokens({ sub: user.id, role: user.role, authType: signServiceInput.authType, clientType: signServiceInput.clientType });
    // save to redis 

    return tokens;
}

export const refreshTokenService = async (token: string) => {
    const decoded = decodeToken(token)
    if (!decoded || typeof decoded === 'string') throw new Error("Invalid token: cannot decode");
    const { sub: userId, role, tokenType, authType, clientType } = decoded;
    if (tokenType !== TOKEN_TYPES.REFRESH) throw new Error('Invalid token type');

    // check and compare in redis
    try {
        verifyToken(token, config.jwt.refreshSecret);
    } catch (error) {
        throw new Error('Invalid or expired refresh token')
    }

    const tokens = createTokens({ sub: userId, role, authType, clientType })
    // save to redis 

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
// helpers 
const createTokens = (payload: object) => ({
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    accessTokenExpiresIn: config.jwt.expiresIn,
    refreshTokenExpiresIn: config.jwt.refreshExpiresIn

})