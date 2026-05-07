import { prisma } from "@/config/database";
import type { CreateStoreSchemaType } from "../validators/store.validator";
import type { CreateProductSchemaType } from "@/validators/product.validator";
import { ApiError } from "@/utils/ApiError";
import { createUserWallet } from "./wallet.service";

export const createStore = async (
  data: CreateStoreSchemaType,
  user: { id: string },
) => {
  const { name, imageUrl, description, marketId, categoryIds, products, bank } =
    data;

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
