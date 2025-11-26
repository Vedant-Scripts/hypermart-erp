import { Router, type IRouter } from "express";
import { createPurchaseBillController, deletPurchaseBillController, getAllPurchaseBillController, getPurchaseBillByIdController, updatePurchaseBillController } from "./purchaseBill.controller.js";
import { authenticateUser } from "../../../common/auth/guards.auth.js";


const router: IRouter = Router();

router.post('/', authenticateUser, createPurchaseBillController);

router.get('/data', authenticateUser, getAllPurchaseBillController);

router.get('/:id', authenticateUser, getPurchaseBillByIdController);

router.patch('/:id', authenticateUser, updatePurchaseBillController);

router.delete('/', authenticateUser, deletPurchaseBillController);

export default router; 