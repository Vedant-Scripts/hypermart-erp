import { Router } from "express";
import { authenticateUser } from "../../../common/auth/guards.auth.js";
import { checkUsedSubcategoryController, createSubcategoryController, deleteSubcategoryController, getAllSubcategoriesController, getSubcategoryByIdController, updateSubcategoryController } from "./subcategories.controller.js";

const router = Router();

router.post('/', authenticateUser, createSubcategoryController);

router.get('/data', authenticateUser, getAllSubcategoriesController);

router.get('/check-used', authenticateUser, checkUsedSubcategoryController);

router.get('/:id', authenticateUser, getSubcategoryByIdController);

router.patch('/:id', authenticateUser, updateSubcategoryController);

router.delete('/:id', authenticateUser, deleteSubcategoryController);


export default router;