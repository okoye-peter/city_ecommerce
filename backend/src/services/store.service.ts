import { prisma } from "@/config/database";
import type { CreateStoreSchemaType, UpdateStoreSchemaType } from "../validators/store.validator";
import type { CreateProductSchemaType } from "@/validators/product.validator";
import { ApiError } from "@/utils/ApiError";
import { createUserWallet } from "./wallet.service";
import { deleteUpload } from "@/utils/cloudinary";
import { OrderGroupStatus, OrderStatus } from "@prisma/client";

function extractPublicId(url: string): string | null {
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return null;
    const afterUpload = url.slice(uploadIndex + 8);
    const withoutVersion = afterUpload.replace(/^v\d+\//, '');
    const dotIndex = withoutVersion.lastIndexOf('.');
    return dotIndex !== -1 ? withoutVersion.slice(0, dotIndex) : withoutVersion;
}

export const createStore = async (
  data: CreateStoreSchemaType,
  user: { id: string },
) => {
  const {
    name,
    imageUrl,
    description,
    marketId,
    categoryIds,
    products,
    bank,
    openDays,
    openingTime,
    closingTime,
  } = data;

  const uniqueStoreCategoryIds = [...new Set(categoryIds || [])];
  if (uniqueStoreCategoryIds.length > 0) {
    const validStoreCategoryIds = await prisma.category.count({
      where: { id: { in: uniqueStoreCategoryIds } },
    });
    if (validStoreCategoryIds !== uniqueStoreCategoryIds.length) {
      throw ApiError.badRequest("invalid store categories selected");
    }
  }

  if ((await prisma.market.count({ where: { id: marketId } })) === 0) {
    throw ApiError.badRequest("invalid market selected");
  }

  if ((await prisma.bank.count({ where: { id: bank.bankId } })) == 0) {
    throw ApiError.badRequest("invalid bank selected");
  }

  const uniqueProductCategoryIds = [
    ...new Set(products?.map((p) => p.categoryId) || []),
  ];
  if (products && products.length > 0) {
    const validProductCategories = await prisma.category.count({
      where: { id: { in: uniqueProductCategoryIds } },
    });
    if (validProductCategories !== uniqueProductCategoryIds.length) {
      throw ApiError.badRequest("invalid product categories selected");
    }
  }

  return await prisma.$transaction(async (tx) => {
    const store = await tx.store.create({
      data: {
        name,
        imageUrl,
        description,
        marketId,
        ownerId: parseInt(user.id),
        openDays: openDays ?? [],
        openingTime,
        closingTime,
        categories: categoryIds
          ? { create: categoryIds.map((id: number) => ({ categoryId: id })) }
          : undefined,
      },
    });

    if (products) {
      await tx.product.createMany({
        data: products.map((product: CreateProductSchemaType) => ({
          ...product,
          storeId: store.id,
        })),
      });
    }

    await tx.userBank.create({
      data: {
        ...bank,
        userId: parseInt(user.id),
      },
    });

    const storeOwner = await prisma.user.findFirst({
      where: {
        id: BigInt(user.id),
      },
    });

    if (storeOwner) await createUserWallet(storeOwner, tx);

    return store;
  });
};

export const getStoreSalesStatsSummary = async (userId: string) => {
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  const storeFilter = { product: { store: { ownerId: BigInt(userId) } } };
  const excludeDeclined = { status: { not: OrderStatus.DECLINED } };

  const [todayStats, yesterdayStats, threeLatestActiveOrder] =
    await Promise.all([
      prisma.order.aggregate({
        where: {
          ...storeFilter,
          ...excludeDeclined,
          createdAt: { gte: today },
        },
        _sum: { totalPrice: true },
        _count: { _all: true },
      }),
      prisma.order.aggregate({
        where: {
          ...storeFilter,
          ...excludeDeclined,
          createdAt: { gte: yesterday, lt: today },
        },
        _sum: { totalPrice: true },
      }),
      prisma.orderGroup.findMany({
        where: {
          status: {
            notIn: [OrderGroupStatus.CANCELLED, OrderGroupStatus.DELIVERED],
          },
          orders: { some: { ...storeFilter, ...excludeDeclined } },
        },
        select: {
          id: true,
          refNo: true,
          totalAmount: true,
          status: true,
          createdAt: true,
          orders: {
            take: 1,
            orderBy: { createdAt: "asc" },
            select: { product: { select: { name: true, imageUrl: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);

  const todayTotal = Number(todayStats._sum.totalPrice ?? 0);
  const yesterdayTotal = Number(yesterdayStats._sum.totalPrice ?? 0);

  return {
    totalOrderCount: todayStats._count._all,
    totalOrderAmount: todayTotal,
    percentage:
      yesterdayTotal > 0
        ? Math.round(((todayTotal - yesterdayTotal) / yesterdayTotal) * 10000) / 100
        : 100,
    activeOrders: threeLatestActiveOrder,
  };
};

export const updateStore = async (userId: string, data: UpdateStoreSchemaType) => {
  const store = await prisma.store.findFirst({ where: { ownerId: BigInt(userId) } });
  if (!store) throw ApiError.notFound('store not found');

  const { categoryIds, ...fields } = data;
  const oldImageUrl = store.imageUrl;
  const imageChanged = fields.imageUrl !== undefined && fields.imageUrl !== oldImageUrl;

  const updatedStore = await prisma.$transaction(async (tx) => {
    if (categoryIds !== undefined) {
        if (categoryIds.length > 0) {
        await tx.categoryStorePivot.deleteMany({ where: { storeId: store.id } });
        await tx.categoryStorePivot.createMany({
          data: categoryIds.map((id) => ({ categoryId: id, storeId: store.id })),
        });
      }
    }

    return tx.store.update({
      where: { id: store.id },
      data: fields,
      include: { categories: true },
    });
  });

  if (imageChanged && oldImageUrl) {
    const publicId = extractPublicId(oldImageUrl);
    if (publicId) await deleteUpload(publicId).catch(() => {});
  }

  return updatedStore;
};

export const getStore = async (userId: string) => {
  const store = await prisma.store.findFirst({
    where: { ownerId: BigInt(userId) },
    include: {
      categories: { include: { category: true } },
      market: true,
      products: { select: { _count: { select: { orders: true } } } },
    },
  });

  if (!store) throw ApiError.notFound('store not found');

  const orderCount = store.products.reduce((sum, p) => sum + p._count.orders, 0);
  const { products: _, ...storeData } = store;

  return { store: storeData, orderCount };
};
