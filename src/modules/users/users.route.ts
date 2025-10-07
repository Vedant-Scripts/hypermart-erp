import { Router } from "express";
import { authenticateUser } from "../../common/auth/guards.auth.js";
import { checkEmailAndMobileController, createUserController, getUsersByController, getUserByIdController, updateUserController, deleteUserController } from "./users.controller.js";

const router = Router();

router.post('/', authenticateUser, createUserController);

router.get('/data', authenticateUser, getUsersByController);

router.get('/check-email-mobile', authenticateUser, checkEmailAndMobileController);

router.get('/:id', authenticateUser, getUserByIdController);

router.patch('/me', authenticateUser, updateUserController); // self update
router.patch('/:id', authenticateUser, updateUserController); 

router.delete('/:id', authenticateUser, deleteUserController);


export default router;