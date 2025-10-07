import type { Role } from "@prisma/client";
import { pickDefined } from "../../common/utils/pickDefined.js";
import type { createUserDTO, updateUserDTO, UserUpdateInput } from "./users.types.js";
import { createUserWithRelationsRepo, deleteUsersWithRelationsRepo, getUserByContactNumberRepo, getUserByEmailRepo, getUserByIdRepo, getUsersByRoleRepo, updateUserRepo } from "./users.repo.js";

export const createUserService = async (data: createUserDTO) => {
    if (data.contactNumber) {
        const checkContactNumberExistence = await getUserByContactNumberRepo(data.contactNumber);
        if (checkContactNumberExistence) throw new Error('Contact Number already Exists');
    }
    if (data.email) {
        const checkEmailExistence = await getUserByEmailRepo(data.email);
        if (checkEmailExistence) throw new Error('Email already Exists');
    }
    return await createUserWithRelationsRepo(data);
}

export const updateUserService = async (userId: string, data: updateUserDTO) => {
    const existing = await getUserByIdRepo(userId);
    if (!existing) throw new Error('User Not Found');

    if (data.contactNumber) {
        const checkMobileUniquenes = await getUserByContactNumberRepo(data.contactNumber);
        if (checkMobileUniquenes && checkMobileUniquenes.id !== userId) throw new Error('Mobile No already Exists')
    }

    if (data.email) {
        const checkEmailUniquenes = await getUserByEmailRepo(data.email);
        if (checkEmailUniquenes && checkEmailUniquenes.id !== userId) throw new Error('Email already Exists')
    }

    const prismaData = pickDefined(data) as UserUpdateInput;

    return await updateUserRepo(userId, prismaData);
}

export const getUserByIdService = async (userId: string) => {
    return await getUserByIdRepo(userId);
}

export const getUsersByRoleService = async (role: Role) => {
    return await getUsersByRoleRepo(role);
}

export const checkEmailAndMobileService = async (field: string, value: string) => {
    const user = field === 'email'
        ? await getUserByEmailRepo(value)
        : await getUserByContactNumberRepo(value);

    return !!user;
}

export const deleteUserService = async (userId: string) => {

    const existing = await getUserByIdRepo(userId);
    if (!existing) throw new Error('User Not Found');

    return await deleteUsersWithRelationsRepo(userId);
}