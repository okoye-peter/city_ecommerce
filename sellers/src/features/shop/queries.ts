import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createProduct, deleteProduct, getProducts, GetProductsParams, getStoreSummary, updateProduct, updateStore } from './api';
import { storeUpdateFormDataSchema } from '@/src/types';
import { useAuthStore } from '../auth/store/authStore';
import { CreateOrUpdateProductSchemaType } from './shopSchema';

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

export const useUpdateStore = () => {
    const queryClient = useQueryClient();
    const setStore = useAuthStore((s) => s.setStore);

    return useMutation({
        mutationFn: (storeData: storeUpdateFormDataSchema) => updateStore(storeData),
        onSuccess: (data) => {
            setStore(data.data);
            queryClient.invalidateQueries({ queryKey: ['auth-user-store-summary'] });
        },
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productData: CreateOrUpdateProductSchemaType) => createProduct(productData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shop-products'] });
        }
    })
}

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, productData }: { productId: string; productData: CreateOrUpdateProductSchemaType }) => 
            updateProduct(productId, productData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shop-products'] });
        }
    })
}

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productId: string) => deleteProduct(productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shop-products'] });
        }
    })
}