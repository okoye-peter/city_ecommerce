import * as productService from "@/services/product.service";
import { catchAsync } from "@/utils/catchAsync";
import { ApiResponse } from "@/utils/ApiResponse";
import { Request, Response } from 'express';
import { CreateProductSchemaType } from "@/validators/product.validator";

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
    return ApiResponse.success(res, product, 'product retrieved successfully');
})

export const createProduct = catchAsync(async (req: Request, res: Response) => {
    const productData: CreateProductSchemaType = req.body;
    const user = req.user;
    const product = await productService.createProduct(user!.id, productData)

    return ApiResponse.success(res, product, 'product created successfully');
})

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const { productId } = req.params
    // { name, price, description, imageUrl, isAvailable, categoryId }
    const productData = req.body;
    await productService.updateProduct(user!.id, productId, productData);

    return ApiResponse.success(res, null, 'product updated successfully');
})

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const user = req.user;

    await productService.deleteProduct(user!.id, productId);

    return ApiResponse.noContent(res);
})

export const getFeaturedProducts = catchAsync(async (req: Request, res: Response) => {
    const stateId = typeof req.query.stateId === 'string' ? req.query.stateId : undefined;
    const limitRaw = typeof req.query.limit === 'string' ? Number(req.query.limit) : undefined;
    const limit = limitRaw !== undefined && !isNaN(limitRaw) ? limitRaw : undefined;

    const products = productService.getFeatureProducts(stateId, limit);
    return ApiResponse.success(res, products, 'featured products retrieved successfully');
})