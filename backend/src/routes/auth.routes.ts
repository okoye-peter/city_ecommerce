import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authLimiter } from '../middlewares/rateLimiter.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  registerSchema,
  loginSchema,
  googleAuthSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshSchema,
  forgotPasswordVerifyOtpSchema,
} from '../validators/auth.validator';

const router = Router();

// Public — email/password
router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/verify-email', validate(verifyEmailSchema), authController.verifyEmail);
router.post('/resend-verification', authLimiter, validate(resendVerificationSchema), authController.resendVerification);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('forgot-password/verify-otp', authLimiter, validate(forgotPasswordVerifyOtpSchema), authController.verifyForgotPasswordOtp)
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), authController.resetPassword);

// Public — Google OAuth
router.post('/google', authLimiter, validate(googleAuthSchema), authController.googleAuth);

// Public — token management
router.post('/refresh', validate(refreshSchema), authController.refreshToken);

// Protected
router.post('/logout', authenticate, authController.logout);
router.get('/profile', authenticate, authController.getProfile);

export default router;
