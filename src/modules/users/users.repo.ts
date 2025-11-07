import type { Role } from "@prisma/client";
import { ROLE_TO_CLIENT } from "../../common/utils/constant.js";
import prisma from "../../common/db.js"
import { hashPassword } from "../../common/utils/password.utils.js";
import type { UserCreateInput, UserUpdateInput } from "./users.types.js";

export const createUserWithRelationsRepo = (dto: any) => {
    const data = dto as UserCreateInput;
    return prisma.$transaction(async (tx) => {

        const user = await tx.user.create({
            data: {
                role: data.role,
                firstName: data.firstName ?? null,
                lastName: data.lastName ?? null,
                email: data.email ?? null,
                contactNumber: data.contactNumber ?? null,
                gender: data.gender ?? null,
                password: (data.password !== undefined && data.password !== null) ? await hashPassword(data.password) : null,
                ... (typeof data.status !== 'undefined' ? { status: data.status } : {}),
                ... (data.addresses ? { addresses: { create: data.addresses } } : {}),
                ... (data.employeeProfile ? { employeeProfile: { create: data.employeeProfile } } : {})
            },
            include: { addresses: true, employeeProfile: true }
        });

        const clientId = ROLE_TO_CLIENT[data.role as keyof typeof ROLE_TO_CLIENT] || 'erp_web';

        await tx.userAllowedClient.create({
            data: {
                user: { connect: { id: user.id } },
                client: { connect: { clientId: clientId } }
            }
        });
        return { user };
    });
}

export const createCustomerUserWithRelationsRepo = (data: { role: Role, contactNumber: string | null, email: string | null }) => {
    return prisma.$transaction(async (tx) => {
        const user = await tx.user.create({ data });
        const clientId = ROLE_TO_CLIENT[data.role as keyof typeof ROLE_TO_CLIENT];

        await tx.userAllowedClient.create({
            data: {
                user: { connect: { id: user.id } },
                client: { connect: { clientId: clientId } }
            }
        });
        return user;
    })
}

export const getUserByEmailRepo = (email: string) => {
    return prisma.user.findFirst({ where: { email: email.toLowerCase().trim(), deletedAt: null } });
};

export const getUserByContactNumberRepo = (contactNumber: string) => {
    return prisma.user.findFirst({ where: { contactNumber, deletedAt: null } });
};

export const getUserByIdRepo = (userId: string) => {
    return prisma.user.findFirst({ where: { id: userId, deletedAt: null }, include: { addresses: true, employeeProfile: true } });
};

export const getUsersByRoleRepo = (role: Role) => {
    return prisma.user.findMany({ where: { role: role, deletedAt: null } });
}

export const updateUserRepo = (userId: string, data: UserUpdateInput) => {
    return prisma.user.update({
        where: { id: userId, deletedAt: null },
        data: {
            ...data,
            // approach 1: replace all existing with new
            ...(data.addresses ? { addresses: { deleteMany: {}, create: data.addresses } } : {}),
            ...(data.employeeProfile ? { employeeProfile: { upsert: { create: data.employeeProfile, update: data.employeeProfile } } } : {})
        },
        include: { employeeProfile: true, addresses: true }
    });
};

export const updateUserPasswordRepo = (userId: string, newHashedPassword: string) => {
    return prisma.user.update({
        where: { id: userId, deletedAt: null },
        data: { password: newHashedPassword },
    });
};

export const deleteUsersWithRelationsRepo = (userId: string) => {
    const deletedAt = new Date();
    return prisma.$transaction(async (tx) => {

        await prisma.user.update({
            where: { id: userId },
            data: { status: 'DELETED', deletedAt: deletedAt }
        });

        await prisma.employeeProfile.updateMany({
            where: { userId: userId },
            data: { deletedAt: deletedAt }
        });

        await prisma.address.updateMany({
            where: { userId: userId },
            data: { deletedAt: deletedAt }
        });

        await tx.userAllowedClient.deleteMany({ where: { userId } });

        return true;
    });
};


// db call to client table

export const getClientByClientIdRepo = (clientId: string) => {
    return prisma.client.findUnique({ where: { clientId: clientId } });
}

export const checkUserClientIdRepo = (userId: string, clientId: string) => {
    return prisma.userAllowedClient.findUnique({
        where: {
            userId_clientId: {
                userId: userId,
                clientId: clientId
            }
        },  
    });
}