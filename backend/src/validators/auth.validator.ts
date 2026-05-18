import { email } from 'zod/v4';
import { forgotPassword } from './../controllers/auth.controller';
import { z } from "zod";

const strongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message:
      "Password must contain uppercase, lowercase, number, and special character",
  });

const otpField = z
  .string()
  .length(6, "OTP must be 6 digits")
  .regex(/^\d{6}$/, "OTP must contain only digits");

export const registerSchema = z.object({
  body: z
    .object({
      firstName: z.string().min(1).max(50).trim(),
      lastName: z.string().min(1).max(50).trim(),
      email: z.string().email().toLowerCase().trim(),
      password: strongPassword,
      passwordConfirmation: z.string().min(1, "Please confirm your password"),
      role: z.enum(['SELLER']).default('SELLER'),
    })
    .refine((d) => d.password === d.passwordConfirmation, {
      message: "Passwords do not match",
      path: ["passwordConfirmation"],
    }),
});

export const registerCustomerSchema = z.object({
  body: z
    .object({
      name: z.string().min(1).max(100).trim(),
      email: z.string().email().toLowerCase().trim(),
      password: strongPassword,
      confirmPassword: z.string().min(1, "Please confirm your password"),
      role: z.enum(['BUYER']).default('BUYER'),
    })
    .refine((d) => d.password === d.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })
    .refine((d) => d.name.trim().split(' ').length >= 2, {
        message: "Please provide your fullname",
        path: ["name"],
    }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email().toLowerCase().trim(),
    password: z.string().min(1),
  }),
});

export const googleAuthSchema = z.object({
  body: z.object({
    idToken: z.string().min(1, "Google ID token is required"),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    email: z.string().email().toLowerCase().trim(),
    otp: otpField,
  }),
});

export const resendVerificationSchema = z.object({
  body: z.object({
    email: z.string().email().toLowerCase().trim(),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email().toLowerCase().trim(),
  }),
});

export const forgotPasswordVerifyOtpSchema = z.object({
    body: z.object({
        email: z.string().email().toLowerCase().trim(),
        otp: otpField
    })
})

export const resetPasswordSchema = z.object({
  body: z
    .object({
      email: z.string().email().toLowerCase().trim(),
      otp: otpField,
      newPassword: strongPassword,
      confirmPassword: z.string(),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),
});
