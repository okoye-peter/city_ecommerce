import api from "@/libs/axios";
import { ApiResponse, Market, Product } from "@/types";

export const getFeaturedMarkets = (stateId: string, limit: number): Promise<ApiResponse<Market>> => 
    api.get(`/markets/popular`, {
        params: {
            stateId,
            limit
        }
    }).then(res => res.data)