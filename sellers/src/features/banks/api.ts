import api from "@/src/lib/axios";
import { ApiResponse, BankAccount, CreateBankAccount } from "@/src/types";

export const getUserBankAccounts = (): Promise<ApiResponse<BankAccount[]>> => 
    api.get('/banks/user-accounts').then(r => r.data)

export const createUserBankAccount = (bankData: CreateBankAccount) =>
    api.post('/banks/user-accounts', bankData).then(r => r.data)

export const updateUserBankAccount = (bankAccountId, bankData: CreateBankAccount) =>
    api.patch(`/banks/user-accounts/${bankAccountId}`, bankData).then(r => r.data)

export const deleteUserBankAccount = (bankAccountId) =>
    api.delete(`/banks/user-accounts/${bankAccountId}`).then(r => r.data)