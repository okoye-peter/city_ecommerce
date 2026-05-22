import { useQuery } from "@tanstack/react-query";
import { getMostPopularProducts } from "./api";

export const useGetPopularProducts = (stateId: string, limit: number) => 
    useQuery({
        queryFn: () => getMostPopularProducts(stateId, limit),
        queryKey: ['get-popular-products']
    })