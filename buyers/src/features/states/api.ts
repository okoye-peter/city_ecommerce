import api from "@/libs/axios";
import { ApiResponse, State } from "@/types";

export const getStates = (): Promise<ApiResponse<State>> => 
    api.get('states').then(res => res.data);