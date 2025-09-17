import { Router } from 'express';
import { signInController, resetPassword, refreshTokenController, forgotPasswordController, changePassword } from './auth.controller.js';
import { authenticate } from '../../common/auth/guards.auth.js';

const router = Router();

// router.post('/sign-up', passwordSignIn)

router.post('/login', signInController);

router.post('/refresh-token', refreshTokenController);

router.post('/forgot-password', forgotPasswordController);

router.patch('/change-password', authenticate, changePassword);

router.patch('/reset-password', resetPassword);

export default router;