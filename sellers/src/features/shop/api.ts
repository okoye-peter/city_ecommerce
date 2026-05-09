import api from '@/src/lib/axios';
import type { StoreSummary, GetProductsParams, ProductsResponse, storeUpdateFormDataSchema, ApiResponse, Store, Product } from '@/src/types';
import { CreateOrUpdateProductSchemaType } from './shopSchema';

export type { Product, GetProductsParams, ProductsResponse, StoreSummary, Market } from '@/src/types';

export const getProducts = (params: GetProductsParams): Promise<ProductsResponse> =>
    api.get('/products', { params }).then((r) => r.data);

export const getStoreSummary = (): Promise<StoreSummary> =>
    api.get('/stores').then((r) => r.data.data);

export const updateStore = (storeUpdateData: storeUpdateFormDataSchema): Promise<ApiResponse<Store>> => 
    api.patch('/stores', storeUpdateData).then(r => r.data)

const toServerPayload = (data: CreateOrUpdateProductSchemaType) => ({
    name: data.name,
    description: data.description,
    price: data.price,
    imageUrl: data.imageUrl,
    isAvailable: data.isAvailable,
    categoryId: data.categoryId,
})

export const createProduct = (createProductData: CreateOrUpdateProductSchemaType): Promise<ApiResponse<Product>> =>
    api.post('/products', toServerPayload(createProductData)).then(r => r.data);

export const updateProduct = (productId: string, updateProductData: CreateOrUpdateProductSchemaType): Promise<ApiResponse<Product>> =>
    api.patch(`/products/${productId}`, toServerPayload(updateProductData)).then(r => r.data);

export const deleteProduct = (productId: string) => 
    api.delete(`/products/${productId}`).then(r => r.data);
