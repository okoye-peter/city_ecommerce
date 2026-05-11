import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getWalletTransactions, getWallet, initiateWithdrawal } from "./api";
import type { GetTransactionParams } from "@/src/types";
import { InitiateWithdrawalParams } from "./earningSchema";

type Filters = Omit<GetTransactionParams, 'page'>;

export const useGetWalletTransactions = (params: Filters) =>
    useInfiniteQuery({
        queryKey: ['wallet-transactions', params],
        queryFn: ({ pageParam }) => getWalletTransactions({ ...params, page: pageParam }),
        getNextPageParam: (lastPage) => {
            const { page, totalPages } = lastPage.meta;
            return page < totalPages ? page + 1 : undefined;
        },
        initialPageParam: 1,
    });

export const useGetWallet = () =>
    useQuery({
        queryKey: ['wallet'],
        queryFn: () => getWallet()
    })

export const useInitiateWithdrawal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: InitiateWithdrawalParams) => initiateWithdrawal(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
        }
    })
}
