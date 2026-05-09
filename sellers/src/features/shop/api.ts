import api from '@/src/lib/axios';
import type { StoreSummary, GetProductsParams, ProductsResponse, storeUpdateFormData, ApiResponse, Store } from '@/src/types';

export type { Product, GetProductsParams, ProductsResponse, StoreSummary, Market } from '@/src/types';

export const getProducts = (params: GetProductsParams): Promise<ProductsResponse> =>
    api.get('/products', { params }).then((r) => r.data);

export const getStoreSummary = (): Promise<StoreSummary> =>
    api.get('/stores').then((r) => r.data.data);

export const updateStore = (storeUpdateData: storeUpdateFormData): Promise<ApiResponse<Store>> => 
    api.patch('/stores', storeUpdateData).then(r => r.data)
