import { catchAsync } from "@/utils/catchAsync";
import { Request, Response } from "express";
import { getAllCategories } from "../services/category.service";
import { ApiResponse } from "@/utils/ApiResponse";

export const getCategories = catchAsync(async (req: Request, res: Response) => {
    const categories = await getAllCategories();
    ApiResponse.success(res, categories, 'Categories retrieved successfully.');
})