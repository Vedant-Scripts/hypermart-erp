import { Router } from "express";
import { authenticateUser } from "../../../common/auth/guards.auth.js";
import { checkUsedBrandController, createBrandController, deleteBrandController, getAllBrandsController, getBrandByIdController, updateBrandController } from "./brands.controller.js";

const router = Router();

router.post('/', authenticateUser, createBrandController);

router.get('/data', authenticateUser, getAllBrandsController);

router.get('/check-used', authenticateUser, checkUsedBrandController);

router.get('/:id', authenticateUser, getBrandByIdController);

router.patch('/:id', authenticateUser, updateBrandController);

router.delete('/:id', authenticateUser, deleteBrandController);


export default router;