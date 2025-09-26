import { pickDefined } from "../../../common/utils/pickDefined.js";
import { createUnitRepo, deleteUnitRepo, getAllUnitsRepo, getUnitByCodeRepo, getUnitByIdRepo, getUnitByNameRepo, updateUnitRepo } from "./units.repo.js";
import type { UnitUpdateInput, CreateUnitDTO, updateUnitDTO } from "./units.type.js";


export const createUnitService = async (data: CreateUnitDTO) => {
    const existingUnit = await getUnitByNameRepo(data.unitName);
    if (existingUnit) throw new Error('Unit already exists');

    const existingUnitCode = await getUnitByCodeRepo(data.unitCode);
    if (existingUnitCode) throw new Error('UnitCode already exists');

    return await createUnitRepo(data);
}


export const updateUnitService = async (unitId: number, data: updateUnitDTO) => {
    const existing = await getUnitByIdRepo(unitId);
    if (!existing) throw new Error('Unit Not Found');

    if (data.unitName) {
        const checkUniquenes = await getUnitByNameRepo(data.unitName);
        if (checkUniquenes && checkUniquenes.id !== unitId) throw new Error('Unit already Exists')
    }

    if (data.unitCode) {
        const checkUniquenes = await getUnitByCodeRepo(data.unitCode);
        if (checkUniquenes && checkUniquenes.id !== unitId) throw new Error('Unit Code already Exists')
    }

    const prismaData = pickDefined(data) as UnitUpdateInput;

    return await updateUnitRepo(unitId, prismaData);
}

export const getUnitByIdService = async (unitId: number) => {
    return await getUnitByIdRepo(unitId);
}

export const getAllUnitsService = async () => {
    return await getAllUnitsRepo();
}

// used unit logic build after product

export const deleteUnitService = async (unitId: number) => {
    // will first check the used unit then would delete it

    const existing = await getUnitByIdRepo(unitId);
    if (!existing) throw new Error('Unit Not Found');

    return await deleteUnitRepo(unitId);
}