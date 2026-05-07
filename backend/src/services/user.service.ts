import { prisma } from "@/config/database";
import { ApiError } from "@/utils/ApiError";
import { encrypt } from "@/utils/encryption";
import { VerificationType } from "@prisma/client";

export const verifyIdentity = async (
  userId: string,
  idType: VerificationType,
  idNumber: string,
  idImageUrl?: string,
) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
  });
  if (!user) {
    throw ApiError.badRequest("User not found");
  }

  if (user && (user.verificationType || user.verificationId)) {
    throw ApiError.badRequest("User identity already verified");
  }

  const hashId = encrypt(idNumber);
  if (
    (await prisma.user.count({
      where: { verificationType: idType, verificationId: hashId },
    })) > 0
  ) {
    throw ApiError.badRequest(
      "This identification number has already been used by another existing user",
    );
  }

  await prisma.user.update({
    where: { id: parseInt(userId) },
    data: {
      verificationType: idType,
      verificationId: hashId,
    },
  });
};

export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    select: {
      id: true,
      email: true,
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
    throw ApiError.badRequest("User not found");
  }
  

  const {  store, ...safeUser } = user;
  return { ...safeUser, storeCount: store ? 1 : 0 };
};

export const toggleIsActive = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
  if (!user) {
    throw ApiError.badRequest("User not found");
  }

  await prisma.user.update({
    where: { id: parseInt(userId) },
    data: {
      isActive: !user.isActive,
    },
  });

  return `user account is now in ${user.isActive ? 'offline' : 'online'} mode`
};
