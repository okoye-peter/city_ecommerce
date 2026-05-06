import { ApiResponse } from "../features/auth/api";
import api from "../lib/axios";
import { Market } from "../types";

export const getMarkets = async (): Promise<ApiResponse<Market[]>> => {
    const res = await api.get('/markets');
    return res.data;
}