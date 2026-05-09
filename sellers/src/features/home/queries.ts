import { useQuery } from "@tanstack/react-query";
import { getStats } from "./api";

export const useGetHomeStats = () =>
    useQuery({
        queryFn: () => getStats(),
        queryKey: ['home-stats'],
    })