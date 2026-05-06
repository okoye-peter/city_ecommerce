import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { ApiResponse } from '../utils/ApiResponse';
import { generateUploadSignature, deleteUpload, CloudinaryFolder } from '../utils/cloudinary';
import { ApiError } from '../utils/ApiError';

export const getUploadSignature = catchAsync(async (req: Request, res: Response) => {
    const folder = (req.query.folder as CloudinaryFolder) ?? 'stores';
    const allowed: CloudinaryFolder[] = ['stores', 'products', 'avatars', 'identity'];

    if (!allowed.includes(folder)) {
        throw ApiError.badRequest(`Invalid folder. Must be one of: ${allowed.join(', ')}`);
    }

    const signature = generateUploadSignature(folder);
    ApiResponse.success(res, signature, 'Upload signature generated');
});

export const deleteFile = catchAsync(async (req: Request, res: Response) => {
    const { publicId } = req.body;
    if (!publicId) throw ApiError.badRequest('publicId is required');

    await deleteUpload(publicId);
    ApiResponse.success(res, null, 'File deleted');
});
