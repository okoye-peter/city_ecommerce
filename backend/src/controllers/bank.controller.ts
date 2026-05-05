import { fetchBanks } from "../services/bank.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";


export const getBanks = catchAsync(async (req, res) => {
    const banks = await fetchBanks();
    ApiResponse.success(res, banks, 'Banks retrieved successfully.');
});