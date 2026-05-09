import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProducts, GetProductsParams, getStoreSummary, updateStore } from './api';
import { storeUpdateFormData } from '@/src/types';
import { useAuthStore } from '../auth/store/authStore';

export const useGetProducts = (params: Omit<GetProductsParams, 'page'> = {}) =>
    useInfiniteQuery({
        queryKey: ['shop-products', params],
        queryFn: ({ pageParam }) => getProducts({ ...params, page: pageParam }),
        getNextPageParam: (lastPage) => lastPage.meta.nextPage ?? undefined,
        initialPageParam: 1,
    });

export const useGetUserStoreSummary = () =>
    useQuery({
        queryFn: () => getStoreSummary(),
        queryKey: ['auth-user-store-summary']
    });

export const useUpdateStore = (storeData: storeUpdateFormData) => {
    const queryClient = useQueryClient();
    const setStore = useAuthStore((s) => s.setStore);

    return useMutation({
        mutationFn: () => updateStore(storeData),
        onSuccess: (data) => {
            setStore(data.data);
            queryClient.invalidateQueries({ queryKey: ['auth-user-store-summary'] });
        },
    });
};