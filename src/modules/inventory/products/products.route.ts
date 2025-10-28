import { Router } from "express";
import { authenticateUser } from "../../../common/auth/guards.auth.js";
import { checkProductExistController, createProductController, generateBarcodeController, getAllProductsController, getProductByIdController } from "./products.controller.js";

const router = Router();

router.get('/generate-barcode', authenticateUser, generateBarcodeController)

router.post('/', authenticateUser, createProductController);

router.get('/data', authenticateUser, getAllProductsController);

router.get('/check-product-existence', authenticateUser, checkProductExistController);

router.get('/:id', authenticateUser, getProductByIdController);

// router.patch('/', authenticateUser, updateProductsByController);

// router.delete('/:id', authenticateUser, deleteCategoryController);


export default router;