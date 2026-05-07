import { fetchMarkets } from "@/services/market.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";


export const getMarkets = catchAsync(async (req, res) => {
    const markets = await fetchMarkets();
    ApiResponse.success(res, markets, 'Markets retrieved successfully.');
});