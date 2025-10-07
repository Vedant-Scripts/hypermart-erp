import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "./index.js";
import config from "../../config/env.config.js";
import { checkUserClientIdRepo, getClientByClientIdRepo, getUserByIdRepo } from "../../modules/users/users.repo.js";


export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const client = res.locals.client;
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace(/^Bearer\s/i, "");
    if (!token) return res.status(401).json({ error: "Missing token" });
    try {
        const payload = verifyToken(token, config.jwt.secret);
        if (client.clientCode !== payload.aud) return res.status(401).json({ error: "Token audience mismatch / account not allowed on this platform" });

        const userExistence = await getUserByIdRepo(payload.sub);
        if (!userExistence) return res.status(404).json({ error: "User not found" });

        if (userExistence.status !== "ACTIVE") return res.status(403).json({ error: "Account inactive" });

        const userClientPlatformCheck = await checkUserClientIdRepo(payload.sub, client.clientId)
        if (!userClientPlatformCheck) return res.status(404).json({ error: "Account access to this platform has been revoked" });

        res.locals.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" })
    }
}

export const authenicateClient = async (req: Request, res: Response, next: NextFunction) => {
    const clientHeader = req.get('x-client-id');
    if (typeof clientHeader !== 'string') return res.status(400).json({ error: "Missing Client" })

    const checkClientExistence = await getClientByClientIdRepo(clientHeader);
    if (!checkClientExistence) return res.status(400).json({ error: 'Unknown client' });

    res.locals.client = { clientId: checkClientExistence.id, clientCode: checkClientExistence.clientId };
    
    next();
}