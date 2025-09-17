import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "./index.js";
import config from "../../config/index.js";


export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace(/^Bearer\s/i, "");
    if (!token) return res.status(401).json({ error: "Missing token" });
    try {
        const payload = verifyToken(token, config.jwt.secret);
        res.locals.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" })
    }
}