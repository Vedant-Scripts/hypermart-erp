import { Router } from "express";
import { authenticate } from "../../../common/auth/guards.auth.js";
import { checkUsedUnitController, createUnitController, deleteUnitController, getAllUnitsController, getUnitByIdController, updateUnitController } from "./units.controller.js";

const router = Router();

router.post('/', authenticate, createUnitController);

router.get('/data', authenticate, getAllUnitsController);

router.get('/check-used', authenticate, checkUsedUnitController);

router.get('/:id', authenticate, getUnitByIdController);

router.patch('/:id', authenticate, updateUnitController);

router.delete('/:id', authenticate, deleteUnitController);


export default router;