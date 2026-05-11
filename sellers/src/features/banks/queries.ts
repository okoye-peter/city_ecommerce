import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUserBankAccount, deleteUserBankAccount, getUserBankAccounts, updateUserBankAccount } from "./api";
import { CreateBankAccount } from "@/src/types";

export const useGetUserBankAccounts = () =>
    useQuery({
        queryKey: ['get-user-banks-accounts'],
        queryFn: () => getUserBankAccounts()
    });

export const useCreateBankAccounts = () => {
    const client = useQueryClient();

    return useMutation({
        mutationFn: (bankAccountData: CreateBankAccount) => createUserBankAccount(bankAccountData),
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['get-user-banks-accounts'] });
        }
    });
}

export const useUpdateBankAccounts = () => {
    const client = useQueryClient();

    return useMutation({
        mutationFn: ({ bankAccountId, bankAccountData }: { bankAccountId: string, bankAccountData: CreateBankAccount }) => 
            updateUserBankAccount(bankAccountId, bankAccountData),
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['get-user-banks-accounts'] });
        }
    });
}

export const useDeleteBankAccounts = () => {
    const client = useQueryClient();

    return useMutation({
        mutationFn: (bankAccountId: string) => deleteUserBankAccount(bankAccountId),
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['get-user-banks-accounts'] });
        }
    });
}