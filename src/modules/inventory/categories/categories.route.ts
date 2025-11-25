import { Router, type IRouter } from "express";
import { authenticateUser } from "../../../common/auth/guards.auth.js";
import { checkUsedCategoryController, createCategoryController, deleteCategoryController, getAllCategoriesController, getCategoryByIdController, updateCategoryController } from "./categories.controller.js";


const router: IRouter = Router();

router.post('/', authenticateUser, createCategoryController);

router.get('/data', authenticateUser, getAllCategoriesController);

router.get('/check-used', authenticateUser, checkUsedCategoryController);

router.get('/:id', authenticateUser, getCategoryByIdController);

router.patch('/:id', authenticateUser, updateCategoryController);

router.delete('/:id', authenticateUser, deleteCategoryController);


export default router;