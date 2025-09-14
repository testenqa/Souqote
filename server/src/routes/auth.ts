import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateRequest, registerSchema, loginSchema } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', validateRequest(registerSchema), AuthController.register);
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.post('/verify-email', AuthController.verifyEmail);
router.post('/verify-phone', AuthController.verifyPhone);
router.post('/resend-verification', AuthController.resendVerification);
router.post('/reset-password', AuthController.resetPassword);

// Protected routes
router.put('/update-password/:userId', authenticateToken, AuthController.updatePassword);

export default router;
