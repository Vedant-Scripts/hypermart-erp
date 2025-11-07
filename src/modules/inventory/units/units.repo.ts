import prisma from "../../../common/db.js";
import type { UnitCreateInput, UnitUpdateInput } from "./units.type.js";

export const createUnitRepo = async (data: UnitCreateInput) => {
    return await prisma.unit.create({ data });
};

export const updateUnitRepo = async (unitId: string, data: UnitUpdateInput) => {
    return await prisma.unit.update({
        where: {
            id: unitId
        },
        data: data
    });
};

export const getUnitByIdRepo = async (unitId: string) => {
    return await prisma.unit.findUnique({ where: { id: unitId } });
};

export const getUnitByNameRepo = async (unitName: string) => {
    return await prisma.unit.findUnique({ where: { unitName: unitName } });
};

export const getUnitByCodeRepo = async (unitCode: string) => {
    return await prisma.unit.findUnique({ where: { unitCode: unitCode } });
};

export const getAllUnitsRepo = async () => {
    return await prisma.unit.findMany();
};

export const deleteUnitRepo = async (unitId: string) => {
    return await prisma.unit.delete({ where: { id: unitId } });
};