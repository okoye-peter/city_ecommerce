import * as productService from "@/services/product.sevice";
import { catchAsync } from "@/utils/catchAsync";
import { ApiResponse } from "@/utils/ApiResponse";
import { Request, Response } from 'express';

export const getPaginatedProducts = catchAsync(async (req: Request, res: Response) => {
    const search = req.query.search as string | undefined;
    const order = (req.query.order as 'asc' | 'desc' | undefined) ?? 'asc';
    const storeId = (req.query.storeId as string | undefined) ?? null;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const { data, meta } = await productService.getProducts(search, order, storeId, page, limit);

    return ApiResponse.paginated(res, data, meta);
})

export const getProductDetails = catchAsync(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const user = req.user
    
    const product = await productService.getProductDetails(user!.id, productId, user!.role)
    ApiResponse.success(res, product, 'product retrieved successfully');
})

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const { productId } = req.params
    // { name, price, description, imageUrl, isAvailable, categoryId }
    const productData = req.body;
    await productService.updateProduct(user!.id, productId, productData);

    ApiResponse.success(res, null, 'product updated successfully');
})

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const user = req.user;

    await productService.deleteProduct(user!.id, productId);

    return ApiResponse.noContent(res);
})