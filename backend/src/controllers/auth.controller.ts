import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { ApiResponse } from '../utils/ApiResponse';
import { catchAsync } from '../utils/catchAsync';

export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  ApiResponse.created(res, result, result.message);
});

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const result = await authService.verifyEmail(email, otp);
  ApiResponse.success(res, result, 'Email verified successfully.');
});

export const resendVerification = catchAsync(async (req: Request, res: Response) => {
  await authService.resendVerification(req.body.email);
  ApiResponse.success(res, null, 'If that email exists and is unverified, a new code has been sent.');
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  ApiResponse.success(res, result, 'Login successful.');
});

export const googleAuth = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.googleAuth(req.body.idToken);
  ApiResponse.success(res, result, 'Authentication successful.');
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.forgotPassword(req.body.email);
  ApiResponse.success(res, null, 'If that email exists, a reset code has been sent.');
});

export const verifyForgotPasswordOtp = catchAsync(async (req: Request, res: Response) => {
    const { email, otp } = req.body
    await authService.verifyForgotPasswordOtp(email, otp)
    ApiResponse.success(res, null, 'OTP verified. You may now reset your password.')
})

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  await authService.resetPassword(email, otp, newPassword);
  ApiResponse.success(res, null, 'Password reset successful. Please log in.');
});

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const tokens = await authService.refreshTokens(req.body.refreshToken);
  ApiResponse.success(res, tokens, 'Tokens refreshed.');
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(req.user!.id);
  ApiResponse.noContent(res);
});

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.getProfile(req.user!.id);
  ApiResponse.success(res, user, 'Profile retrieved.');
});
