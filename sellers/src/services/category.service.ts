import { ApiResponse } from "../features/auth/api";
import api from "../lib/axios";
import { Category } from "../types";

export const getCategories = async (): Promise<ApiResponse<Category[]>> => {
    const res = await api.get('/categories');
    return res.data;
}