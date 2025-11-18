import { Router } from "express";
import { createPurchaseBillController, deletPurchaseBillController, getAllPurchaseBillController, getPurchaseBillByIdController, updatePurchaseBillController } from "./purchaseBill.controller.js";
import { authenticateUser } from "../../../common/auth/guards.auth.js";

const router = Router();

router.post('/', authenticateUser, createPurchaseBillController);

router.get('/:id', authenticateUser, getPurchaseBillByIdController);

router.get('/data', authenticateUser, getAllPurchaseBillController);

router.patch('/:id', authenticateUser, updatePurchaseBillController);

router.delete('/', authenticateUser, deletPurchaseBillController);

export default router;