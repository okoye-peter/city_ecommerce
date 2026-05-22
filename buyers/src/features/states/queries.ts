import { useQuery } from "@tanstack/react-query";
import { getStates } from "./api";

export const useGetStates = () => 
    useQuery({
        queryFn: () => getStates(),
        queryKey: ['get-states']
    })