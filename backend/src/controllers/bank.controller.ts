import * as bankService from "../services/bank.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";
import { Request, Response } from "express";

export const getBanks = catchAsync(async (req: Request, res: Response) => {
  const banks = await bankService.fetchBanks();
  ApiResponse.success(res, banks, "Banks retrieved successfully.");
});

export const getUserBanks = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;
  const banks = await bankService.getUserBankAccounts(user.id);
  ApiResponse.success(res, banks, "user banks accounts retrieved successfully");
});

export const createUserBankAccount = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { accountNumber, bankId } = req.body;
    const bankAccount = await bankService.addUserBank(user?.id!, {
      accountNumber,
      bankId,
    });

    return ApiResponse.success(
      res,
      bankAccount,
      "user bank account created successfully",
    );
  },
);

export const updateUserBankAccount = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { accountBankId } = req.params;
    const { accountNumber, bankId } = req.body;
    const bankAccount = await bankService.editUserBanks(
      user?.id!,
      accountBankId,
      { accountNumber, bankId },
    );

    return ApiResponse.success(
      res,
      bankAccount,
      "user bank account updated successfully",
    );
  },
);

export const deleteUserBankAccount = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { accountBankId } = req.params;
    const bankAccount = await bankService.deleteBank(user?.id!, accountBankId);

    return ApiResponse.success(
      res,
      null,
      "user bank account deleted successfully",
    );
  },
);
