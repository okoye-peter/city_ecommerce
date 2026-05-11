import { ApiError } from "@/utils/ApiError";
import { prisma } from "../config/database";
import { decrypt, encrypt } from "@/utils/encryption";
import { bankSchemaType } from "@/validators/bank.validator";

export const fetchBanks = async () => {
  const banks = await prisma.bank.findMany();
  return banks;
};

export const getUserBankAccounts = async (userId: string) => {
  const bankAccounts = await prisma.userBank.findMany({
    where: {
      userId: BigInt(userId),
    },
    include: {
      bank: true,
    },
  });

  return bankAccounts.map((bank) => ({
    ...bank,
    accountNumber: decrypt(bank.accountNumber)
  }));
};

export const addUserBank = async (
  userId: string,
  bankData: bankSchemaType,
) => {
  const uId = BigInt(userId);
  const bId = BigInt(bankData.bankId);

  const bankCount = await prisma.userBank.count({
    where: { userId: uId },
  });

  if (bankCount >= 3) {
    throw ApiError.badRequest("User is only permitted to add 3 bank accounts");
  }

  const bank = await prisma.bank.findUnique({
    where: { id: bId },
    select: { id: true },
  });

  if (!bank) {
    throw ApiError.notFound("Selected bank not found");
  }

  const encryptedAccount = encrypt(bankData.accountNumber);

  const duplicate = await prisma.userBank.findFirst({
    where: {
      bankId: bId,
      accountNumber: encryptedAccount 
    },
    select: { id: true },
  });

  if (duplicate) {
    throw ApiError.badRequest("The provided bank details are already in use");
  }

  return await prisma.userBank.create({
    data: {
      accountNumber: encryptedAccount,
      bankId: bId,
      userId: uId,
    },
  });
};

export const editUserBanks = async (
  userId: string,
  userBankId: string,
  bankData: bankSchemaType,
) => {
  const uId = BigInt(userId);
  const bId = BigInt(bankData.bankId);
  const uBId = BigInt(userBankId);

  const userBankExists = await prisma.userBank.findFirst({
    where: {
      id: uBId,
      userId: uId,
    },
    select: { id: true },
  });

  if (!userBankExists) throw ApiError.notFound("user bank not found");

  const bank = await prisma.bank.findUnique({
    where: { id: bId },
    select: { id: true },
  });

  if (!bank) {
    throw ApiError.notFound("Selected bank not found");
  }

  const encryptedAccount = encrypt(bankData.accountNumber);

  return await prisma.userBank.update({
    where: {
        id: uBId
    },
    data: {
      accountNumber: encryptedAccount,
      bankId: bId,
      updatedAt: new Date()
    },
  });
};

export const deleteBank = async (userId: string, userBankId: string) => {
    const uId = BigInt(userId);
    const uBId= BigInt(userBankId);

    const userBank = await prisma.userBank.findFirst({
        where: {
            userId: uId,
            id: uBId
        }
    })

    if(!userBank)
        throw ApiError.forbidden('user not allowed to delete bank account');

    return await prisma.userBank.delete({
        where: {
            userId: uId,
            id: uBId
        }
    })
}
