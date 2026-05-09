import { prisma } from "@/config/database";
import { ApiError } from "@/utils/ApiError";
import { Product, Role } from "@prisma/client";

export const getProducts = async (
    searchQuery = '',
    order: 'asc' | 'desc' = 'asc',
    storeId: string | null = null,
    page = 1,
    limit = 10,
) => {
    const skip = (page - 1) * limit;

    const where = {
        ...(searchQuery && { name: { contains: searchQuery, mode: 'insensitive' as const } }),
        ...(storeId && { storeId: BigInt(storeId) }),
    };

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy: { name: order },
            skip,
            take: limit,
            include: { category: true },
        }),
        prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return {
        data: products,
        meta: {
            total,
            page,
            limit,
            totalPages,
            hasMore,
            nextPage: hasMore ? page + 1 : null,
        },
    };
};

export const getProductDetails = async (userId: string, productId: string, role?: Role) => {

    const product = await prisma.product.findFirst({
        where: {
            id: BigInt(productId),
            ...(role && role === Role.SELLER && {store: { ownerId: BigInt(userId) }})
        }
    })

    if(!product)
        throw ApiError.notFound('product not found');

    return product;
}

export const updateProduct = async (userId: string, productId: string, productData: Omit<Product, "id" | "createdAt" | "updatedAt" | "storeId">) => {
    const product = await prisma.product.findFirst({
        where: {
            id: BigInt(productId),
            store: { ownerId: BigInt(userId) }
        }
    });

    if(!product) {
        throw ApiError.notFound('product not found')
    }

    const category = productData.categoryId
        ? await prisma.category.findFirst({ where: { id: productData.categoryId } })
        : null;

    if(!category)
        throw ApiError.badRequest('Invalid category selected');

    prisma.product.update({
        where: {
            id: BigInt(productId),
            store: { ownerId: BigInt(userId) }
        },
        data: {
            ...productData,
            imageUrl: productData.imageUrl?.trim() || product.imageUrl,
            categoryId: productData.categoryId || product.categoryId,
            updatedAt: new Date()
        }
    })
}

export const deleteProduct = async (userId: string, productId: string) => {
    const product = await prisma.product.findFirst({
        where: {
            id: BigInt(productId),
            store: { ownerId: BigInt(userId) },
        },
    });

    if (!product) throw ApiError.notFound('product not found');

    await prisma.product.delete({ where: { id: BigInt(productId) } });
};