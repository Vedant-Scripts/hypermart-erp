import { Router } from "express";
import { authenticate } from "../../../common/auth/guards.auth.js";
import { checkUsedSubcategoryController, createSubcategoryController, deleteSubcategoryController, getAllSubcategoriesController, getSubcategoryByIdController, updateSubcategoryController } from "./subcategories.controller.js";

const router = Router();

router.post('/', authenticate, createSubcategoryController);

router.get('/', authenticate, getAllSubcategoriesController);

router.get('/check-used', authenticate, checkUsedSubcategoryController);

router.get('/:id', authenticate, getSubcategoryByIdController);

router.patch('/:id', authenticate, updateSubcategoryController);

router.delete('/:id', authenticate, deleteSubcategoryController);


export default router;