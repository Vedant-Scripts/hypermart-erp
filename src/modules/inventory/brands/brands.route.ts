import { Router } from "express";
import { authenticate } from "../../../common/auth/guards.auth.js";
import { checkUsedBrandController, createBrandController, deleteBrandController, getAllBrandsController, getBrandByIdController, updateBrandController } from "./brands.controller.js";

const router = Router();

router.post('/', authenticate, createBrandController);

router.get('/data', authenticate, getAllBrandsController);

router.get('/check-used', authenticate, checkUsedBrandController);

router.get('/:id', authenticate, getBrandByIdController);

router.patch('/:id', authenticate, updateBrandController);

router.delete('/:id', authenticate, deleteBrandController);


export default router;