import { useQuery } from "@tanstack/react-query";
import { getFeaturedMarkets } from "./api";

export const useGetMostPopularMarkets = (stateId: string, limit: number) =>
    useQuery({
        queryFn: () => getFeaturedMarkets(stateId, limit),
        queryKey: ['get-popular-markets', stateId, limit]
    })