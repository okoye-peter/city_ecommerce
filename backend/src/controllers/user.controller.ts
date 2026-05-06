import { catchAsync } from "@/utils/catchAsync";
import { ApiResponse } from "@/utils/ApiResponse";
import { Request, Response } from "express";
import * as userService from '../services/user.service';

export const verifyUserIdentity = catchAsync(async (req: Request, res: Response) => {
    const { verificationType, verificationId } = req.body
    const userId = req.user!.id

    await userService.verifyIdentity(userId, verificationType, verificationId)
    ApiResponse.success(res, null, 'Identity verified successfully.')
})

export const getUserProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id
    const userProfile = await userService.getUserProfile(userId)
    ApiResponse.success(res, {user: userProfile }, 'User profile retrieved successfully.')
})

export const toggleUserStatus = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const message = await userService.toggleIsActive(userId);
    ApiResponse.success(res, null, message)
})