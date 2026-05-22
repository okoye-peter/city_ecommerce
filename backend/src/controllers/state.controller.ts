import { catchAsync } from "@/utils/catchAsync";
import { Request, Response } from 'express';
import * as stateService from '@/services/state.service';
import { ApiResponse } from "@/utils/ApiResponse";

export const getAllStates = catchAsync(async (req: Request, res: Response) => {
    const states = await stateService.getStates();
    ApiResponse.success(res, states, 'states retrieved successfully');
})


// export const getMarkets = catchAsync(async (req, res) => {
//     const markets = await fetchMarkets();
//     ApiResponse.success(res, markets, 'Markets retrieved successfully.');
// });