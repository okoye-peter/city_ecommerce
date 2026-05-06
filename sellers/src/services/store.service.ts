import api from '../lib/axios';
import { ApiResponse } from '../features/auth/api';

export interface CreateStoreProduct {
    name: string;
    description: string;
    price: number;
    isAvailable: boolean;
    categoryId: number;
    imageUrl: string;
}

export interface CreateStorePayload {
    name: string;
    imageUrl: string;
    description?: string;
    marketId: number;
    categoryIds?: number[];
    products?: CreateStoreProduct[];
    bank: {
        bankId: number;
        accountNumber: string;
    };
}

export const createStore = async (payload: CreateStorePayload): Promise<ApiResponse<unknown>> => {
    const res = await api.post('/stores', payload);
    return res.data;
};
