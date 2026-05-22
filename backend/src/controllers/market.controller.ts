import * as marketService from "@/services/market.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";
import { Request, Response } from 'express';


export const getMarkets = catchAsync(async (req: Request, res: Response) => {
  const markets = await marketService.fetchMarkets();
  ApiResponse.success(res, markets, "Markets retrieved successfully.");
});

export const getTopMarkets = catchAsync(async(req: Request, res: Response) => {
    const stateId = typeof req.query.stateId === 'string' ? req.query.stateId : undefined;
    const limitRaw = typeof req.query.limit === 'string' ? Number(req.query.limit) : undefined;
    const limit = limitRaw !== undefined && !isNaN(limitRaw) ? limitRaw : undefined;
    const markets = await marketService.getTop4MarketWithMostSellers(stateId, limit);
    ApiResponse.success(res, markets, "Top markets retrieved successfully.");
})