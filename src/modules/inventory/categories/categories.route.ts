import { Router } from "express";
import { authenticate } from "../../../common/auth/guards.auth.js";
import { checkUsedCategoryController, createCategoryController, deleteCategoryController, getAllCategoriesController, getCategoryByIdController, updateCategoryController } from "./categories.controller.js";

const router = Router();

router.post('/', authenticate, createCategoryController);

router.get('/data', authenticate, getAllCategoriesController);

router.get('/check-used', authenticate, checkUsedCategoryController);

router.get('/:id', authenticate, getCategoryByIdController);

router.patch('/:id', authenticate, updateCategoryController);

router.delete('/:id', authenticate, deleteCategoryController);


export default router;