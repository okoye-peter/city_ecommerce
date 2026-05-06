import { ApiResponse } from './../features/auth/api';
import api from "../lib/axios";
import { Bank } from "../types";


export const getBanks = async (): Promise<ApiResponse<Bank[]>> => {
    const res = await  api.get('/banks');
    return  res.data;
}