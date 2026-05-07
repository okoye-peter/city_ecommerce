import { catchAsync } from "@/utils/catchAsync";
import { Request, Response } from "express";
import * as storeService from "../services/store.service";
import { ApiResponse } from "../utils/ApiResponse";

export const createStore = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;
  const store = await storeService.createStore(req.body, user);
  ApiResponse.success(res, store, "Store created successfully");
});
