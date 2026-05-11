import { catchAsync } from "@/utils/catchAsync";
import { Request, Response } from 'express'
import * as walletService from '@/services/wallet.service'
import { ApiResponse } from "@/utils/ApiResponse";

export const getTransaction = async () => {

}

export const getUserWallet = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const wallet = await walletService.getWallet(user?.id!, user?.role!)
    ApiResponse.success(res, wallet, 'wallet retrieved successfully');
})

export const walletTransactions = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const from = req.query.from ? new Date(req.query.from as string) : undefined;
    const to = req.query.to ? new Date(req.query.to as string) : undefined;

    const { transactions, meta } = await walletService.getWalletTransactions(
        user?.id!, user?.role!, page, limit,
        { from, to },
    );
    ApiResponse.paginated(res, transactions as unknown[], meta, 'Transactions retrieved successfully');
})

export const initiateWithdrawal = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const { amount, bankAccountId } = req.body;

    const withdrawal = await walletService.initiateWithdrawal(user?.id!, user?.role!, amount, bankAccountId);
    ApiResponse.success(res, withdrawal, 'Withdrawal processed successfully');
})