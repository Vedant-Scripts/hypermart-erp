import type { Prisma } from "@prisma/client";
import prisma from "../../common/db.js"

export const findUserByEmail = (email: string) => {
    return prisma.user.findUnique({ where: { email } });
}

export const findUserById = (userId: number) => {
    return prisma.user.findUnique({ where: { id: userId } })
}

export const updateUser = (userId: number, data: Partial<Prisma.UserUpdateInput>) => {
    return prisma.user.update({
        where: { id: userId },
        data,
    });
};

export const updateUserPassword = (userId: number, newHashedPassword: string) => {
    return prisma.user.update({
        where: { id: userId },
        data: { password: newHashedPassword },
    });
};

