import type { NextFunction, Request, Response } from "express";
import { updateUserPayloadSchema, UserPayloadSchema } from "./users.validation.js";
import { checkEmailAndMobileService, createUserService, getUsersByRoleService, getUserByIdService, updateUserService, deleteUserService } from "./users.service.js";
import { Role } from "../../generated/prisma/client.js";

export const createUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // validate with zod
        const parsed = UserPayloadSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ errors: parsed.error });

        // call service
        const user = await createUserService(parsed.data)

        return res.status(201).json({ message: 'User Created', data: user })

    } catch (error) {
        next(error)
    }
};

export const getUserByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        if (!userId) return res.status(400).json({ message: "User id is required" });

        const user = await getUserByIdService(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ message: "User found", data: user });
    } catch (error) {
        next(error);
    }
};

export const getUsersByController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let role = req.query.role;
        if (typeof role !== 'string') return res.status(400).json({ message: "Invalid Role" });
        role = role.toUpperCase();
        if (!role || !Object.values(Role).includes(role as Role)) return res.status(400).json({ message: "Invalid Role" });
        const roleValue = role as Role;
        const users = await getUsersByRoleService(roleValue);

        if (!users) return res.status(404).json({ message: "Users not found" });

        return res.status(200).json({ message: "User found", data: users });
    } catch (error) {
        next(error);
    }
};

export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id ?? res.locals.user.sub;
        if (typeof userId !== 'string' || !userId) return res.status(400).json({message:'User ID not found in params or token'})

        // validate with zod
        const parsed = updateUserPayloadSchema.safeParse(req.body);

        if (!parsed.success) return res.status(400).json({ errors: parsed.error });
        // call service 
        const user = await updateUserService(userId, parsed.data);

        return res.status(200).json({ message: 'User Updated', data: user })
    } catch (error) {
        next(error)
    }
};

export const checkEmailAndMobileController = async (req: Request, res: Response, next: NextFunction) => {
    const field = req.query.field;
    const value = req.query.value;
    if (typeof field !== "string" || typeof value !== "string") return res.status(400).json({ message: 'Field and Value is required' });
    if (field !== 'email' && field !== 'mobile') return res.status(400).json({ message: 'Field name is Invalid' });
    const result = await checkEmailAndMobileService(field, value);
    return res.status(200).json(result);
};

export const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const contactId = req.params.id;
        if (!contactId) return res.status(400).json({ message: "User id is required" });

        await deleteUserService(contactId);
        return res.status(204).send();
    } catch (error) {
        next(error)
    }
};