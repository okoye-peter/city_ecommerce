import { catchAsync } from "@/utils/catchAsync";
import { Request, Response } from "express";
import * as storeService from "../services/store.service";
import { ApiResponse } from "../utils/ApiResponse";

export const createStore = catchAsync(async (req: Request, res: Response) => {
  const store = await storeService.createStore(req.body, req.user!);
  ApiResponse.created(res, store, "Store created successfully");
});

export const getUserStore = catchAsync(async (req: Request, res: Response) => {
  const data = await storeService.getStore(req.user!.id);
  ApiResponse.success(res, data, "Store retrieved successfully");
});

export const updateStore = catchAsync(async (req: Request, res: Response) => {
  const store = await storeService.updateStore(req.user!.id, req.body);
  ApiResponse.success(res, store, "Store updated successfully");
});

export const getStats = catchAsync(async (req: Request, res: Response) => {
  const data = await storeService.getStoreSalesStatsSummary(req.user!.id);
  ApiResponse.success(res, data, "Store stats retrieved successfully");
});
