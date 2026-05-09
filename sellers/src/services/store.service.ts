import api from '../lib/axios';
import type { ApiResponse, CreateStorePayload, CreatedStore } from '@/src/types';

export type { CreateStoreProduct, CreateStorePayload, CreatedStore } from '@/src/types';

export const createStore = async (payload: CreateStorePayload): Promise<ApiResponse<CreatedStore>> => {
    const res = await api.post('/stores', payload);
    return res.data;
};
