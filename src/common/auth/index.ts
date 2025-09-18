import jwt from "jsonwebtoken";
import config from "../../config/env.config.js";
import { TOKEN_TYPES } from "../constant.js";


export const signAccessToken = (payload: object) => {
    return jwt.sign({ ...payload, tokenType: TOKEN_TYPES.ACCESS }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
}

export const signRefreshToken = (payload: object) => {
    return jwt.sign({ ...payload, tokenType: TOKEN_TYPES.REFRESH }, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn });
}

export const verifyToken = <T = any>(token: string, secret: string): T => {
    return jwt.verify(token, secret) as T
}

export const decodeToken = (token: string) => {
    return jwt.decode(token);
}


