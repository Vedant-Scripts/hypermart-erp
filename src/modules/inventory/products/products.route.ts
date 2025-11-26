import { Router, type IRouter } from "express";
import { authenticateUser } from "../../../common/auth/guards.auth.js";
import { checkProductExistController, createProductController, generateBarcodeController, getAllProductsController, getProductByIdController, updateProductsByController } from "./products.controller.js";


const router: IRouter = Router();

router.get('/generate-barcode', authenticateUser, generateBarcodeController)

router.post('/', authenticateUser, createProductController);

router.get('/data', authenticateUser, getAllProductsController);

router.get('/check-product-existence', authenticateUser, checkProductExistController);

router.get('/:id', authenticateUser, getProductByIdController);

router.patch('/', authenticateUser, updateProductsByController);

router.delete('/', authenticateUser, checkProductExistController);


export default router;