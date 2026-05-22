import api from "@/libs/axios";
import { ApiResponse, Product } from "@/types";


export const getMostPopularProducts = (stateId: string, limit: number): Promise<ApiResponse<Product>> => 
    api.get('/products/popular', {
        params: {
            stateId,
            limit
        }
    }).then(res => res.data)