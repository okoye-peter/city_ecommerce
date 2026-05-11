import api from "@/src/lib/axios";
import {  GetTransactionParams, PaginatedResponse, SellerTransaction, SellerWallet } from "@/src/types";
import { InitiateWithdrawalParams } from "./earningSchema";

export const getWallet = (): Promise<SellerWallet> =>
    api.get('/wallets').then(r => r.data.data);

export const getWalletTransactions = (
    params: GetTransactionParams,
): Promise<PaginatedResponse<SellerTransaction>> => {
    const query: Record<string, string> = {};
    if (params.page) query.page = String(params.page);
    if (params.limit) query.limit = String(params.limit);
    if (params.from) query.from = params.from;
    if (params.to) query.to = params.to;

    return api.get('/wallets/transactions', { params: query }).then(r => r.data);
};


export const initiateWithdrawal = (data: InitiateWithdrawalParams): Promise<void> =>
    api.post('/wallets/withdrawal', data).then(r => r.data);