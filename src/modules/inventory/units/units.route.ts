import { Router, type IRouter } from "express";
import { authenticateUser } from "../../../common/auth/guards.auth.js";
import { checkUsedUnitController, createUnitController, deleteUnitController, getAllUnitsController, getUnitByIdController, updateUnitController } from "./units.controller.js";


const router: IRouter = Router();

router.post('/', authenticateUser, createUnitController);

router.get('/data', authenticateUser, getAllUnitsController);

router.get('/check-used', authenticateUser, checkUsedUnitController);

router.get('/:id', authenticateUser, getUnitByIdController);

router.patch('/:id', authenticateUser, updateUnitController);

router.delete('/:id', authenticateUser, deleteUnitController);


export default router;