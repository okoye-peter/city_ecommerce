import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { Role } from '@prisma/client';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { sendVerificationEmail, sendPasswordResetEmail } from './email.service';
import { createUserWallet } from './wallet.service';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

// ─── Token helpers ────────────────────────────────────────────────────────────

function generateAccessToken(payload: { id: string; email: string; role: Role }) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY as jwt.SignOptions['expiresIn'],
  });
}

function generateRefreshToken(payload: { id: string }) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY as jwt.SignOptions['expiresIn'],
  });
}

async function issueTokens(userId: string, email: string, role: Role) {
  const accessToken = generateAccessToken({ id: userId, email, role });
  const refreshToken = generateRefreshToken({ id: userId });
  await prisma.user.update({
    where: { id: BigInt(userId) },
    data: {
      refreshToken: await bcrypt.hash(refreshToken, 10),
      lastLoginAt: new Date(),
    },
  });
  return { accessToken, refreshToken };
}

// ─── OTP helpers ──────────────────────────────────────────────────────────────

function generateOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

async function hashOtp(otp: string): Promise<string> {
  return bcrypt.hash(otp, 10);
}

async function verifyOtp(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

// ─── Auth flows ───────────────────────────────────────────────────────────────

export async function register(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: Role;
}) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });

  if (existing) {
    if (existing.googleId && !existing.password) {
      throw ApiError.conflict('An account with this email exists. Please sign in with Google.');
    }
    throw ApiError.conflict('An account with this email already exists.');
  }

  const hashed = await bcrypt.hash(input.password, env.BCRYPT_SALT_ROUNDS);
  const otp = generateOtp();

  const user = await prisma.user.create({
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      password: hashed,
      role: input.role ?? Role.BUYER,
      emailVerifyOtp: await hashOtp(otp),
      emailVerifyOtpExpiry: new Date(Date.now() + OTP_TTL_MS),
    },
  });

  if(user.role === Role.BUYER) await createUserWallet(user);

  return {
    message: 'Registration successful.',
    email: user.email,
  };
}

export async function verifyEmail(email: string, otp: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.emailVerifyOtp || !user.emailVerifyOtpExpiry) {
    throw ApiError.badRequest('No pending verification for this email.');
  }
  if (user.isVerified) {
    throw ApiError.badRequest('Email is already verified.');
  }
  if (user.emailVerifyOtpExpiry < new Date()) {
    throw ApiError.badRequest('Verification code has expired. Request a new one.');
  }

  const valid = await verifyOtp(otp, user.emailVerifyOtp);
  if (!valid) {
    throw ApiError.badRequest('Invalid verification code.');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      emailVerifyOtp: null,
      emailVerifyOtpExpiry: null,
    },
  });

  const tokens = await issueTokens(user.id.toString(), user.email, user.role);
  const { password: _, refreshToken: __, emailVerifyOtp: ___, emailVerifyOtpExpiry: ____, passwordResetOtp: _____, passwordResetOtpExpiry: ______, ...safeUser } = user;
  return { user: { ...safeUser, isVerified: true }, ...tokens };
}

export async function resendVerification(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.isVerified) return; // silent — don't reveal account existence

  const otp = generateOtp();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerifyOtp: await hashOtp(otp),
      emailVerifyOtpExpiry: new Date(Date.now() + OTP_TTL_MS),
    },
  });

  await sendVerificationEmail(user.email, user.firstName, otp);
}

export async function login(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ 
    where: { email: input.email },
    select: {
      id: true,
      email: true,
      password: true,
      googleId: true,
      firstName: true,
      lastName: true,
      avatar: true,
      isOnline: true,
      role: true,
      verificationType: true,
      verificationId: true,
      isVerified: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      store: {
        select: { id: true },
      },
    },

});

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  if (user.googleId && !user.password) {
    throw ApiError.unauthorized('This account uses Google Sign-In. Please sign in with Google.');
  }

  if (!user.password) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  const match = await bcrypt.compare(input.password, user.password);
  if (!match) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  if (!user.isVerified) {
    const otp = generateOtp();
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifyOtp: await hashOtp(otp),
        emailVerifyOtpExpiry: new Date(Date.now() + OTP_TTL_MS),
      },
    });
    await sendVerificationEmail(user.email, user.firstName, otp);
    // throw ApiError.forbidden(
    //   'Email not verified. A new verification code has been sent to your email.',
    // );
  }

  const tokens = await issueTokens(user.id.toString(), user.email, user.role);
  const { password: _, store, ...safeUser } = user;
  return { user: { ...safeUser, storeCount: store ? 1 : 0 }, ...tokens };
}

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  // Always return silently to prevent user enumeration
  if (!user || !user.isActive || !user.password) return;

  const otp = generateOtp();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetOtp: await hashOtp(otp),
      passwordResetOtpExpiry: new Date(Date.now() + OTP_TTL_MS),
    },
  });

  await sendPasswordResetEmail(user.email, user.firstName, otp);
}

export async function verifyForgotPasswordOtp(email: string, otp: string) {
    const user = await prisma.user.findUnique({ where: { email, passwordResetOtp: otp } });

    if(!user) {
        throw ApiError.badRequest('Invalid password reset OTP')
    }

    if (!user.passwordResetOtpExpiry || user.passwordResetOtpExpiry < new Date()) {
        throw ApiError.badRequest('Reset code has expired. Request a new one.');
    }

    return 

}

export async function resetPassword(email: string, otp: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.passwordResetOtp || !user.passwordResetOtpExpiry) {
    throw ApiError.badRequest('No password reset request found for this email.');
  }
  if (user.passwordResetOtpExpiry < new Date()) {
    throw ApiError.badRequest('Reset code has expired. Request a new one.');
  }

  const valid = await verifyOtp(otp, user.passwordResetOtp);
  if (!valid) {
    throw ApiError.badRequest('Invalid reset code.');
  }

  const hashed = await bcrypt.hash(newPassword, env.BCRYPT_SALT_ROUNDS);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      passwordResetOtp: null,
      passwordResetOtpExpiry: null,
      refreshToken: null, // invalidate all active sessions
    },
  });
}

export async function googleAuth(idToken: string) {
  let ticket;
  try {
    ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
  } catch {
    throw ApiError.unauthorized('Invalid Google token.');
  }

  const payload = ticket.getPayload();
  if (!payload?.email) {
    throw ApiError.badRequest('Google account must have a verified email.');
  }

  const {
    sub: googleId,
    email,
    given_name: firstName = '',
    family_name: lastName = '',
    picture: avatar,
  } = payload;

  let user = await prisma.user.findFirst({
    where: { OR: [{ googleId }, { email }] },
  });

  if (user) {
    if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId, avatar: avatar ?? user.avatar, isVerified: true },
      });
    }
    // if (!user.isActive) throw ApiError.forbidden('Account is deactivated.');
  } else {
    user = await prisma.user.create({
      data: { email, googleId, firstName, lastName, avatar, isVerified: true },
    });
  }

  const tokens = await issueTokens(user.id.toString(), user.email, user.role);
  const { password: _, refreshToken: __, emailVerifyOtp: ___, emailVerifyOtpExpiry: ____, passwordResetOtp: _____, passwordResetOtpExpiry: ______, ...safeUser } = user;
  return { user: safeUser, ...tokens };
}

export async function refreshTokens(token: string) {
  let payload: { id: string };
  try {
    payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string };
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token.');
  }

  const user = await prisma.user.findUnique({ where: { id: BigInt(payload.id) } });
  if (!user?.refreshToken) throw ApiError.unauthorized('Refresh token not found.');

  const valid = await bcrypt.compare(token, user.refreshToken);
  if (!valid) throw ApiError.unauthorized('Refresh token mismatch.');

  const accessToken = generateAccessToken({ id: user.id.toString(), email: user.email, role: user.role });
  const newRefreshToken = generateRefreshToken({ id: user.id.toString() });

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: await bcrypt.hash(newRefreshToken, 10) },
  });

  return { accessToken, refreshToken: newRefreshToken };
}

export async function logout(userId: string) {
  await prisma.user.update({
    where: { id: BigInt(userId) },
    data: { refreshToken: null },
  });
}
