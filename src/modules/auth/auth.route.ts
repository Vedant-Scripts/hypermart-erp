import { Router, type IRouter } from 'express';
import { signInController, refreshTokenController, forgotPasswordController, changePasswordController, resetPasswordController, sendOtpController } from './auth.controller.js';
import { authenticateUser } from '../../common/auth/guards.auth.js';


const router: IRouter = Router();

router.post('/send-otp', sendOtpController);

router.post('/login', signInController);

router.post('/refresh-token', refreshTokenController);

router.post('/forgot-password', forgotPasswordController);      // needs email to do it

router.patch('/change-password', authenticateUser, changePasswordController);

router.patch('/reset-password', resetPasswordController);

export default router;