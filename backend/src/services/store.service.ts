import { prisma } from "@/config/database";
import type { CreateStoreSchemaType } from "../validators/store.validator";
import type { CreateProductSchemaType } from "@/validators/product.validator";
export const createStore = async (data: CreateStoreSchemaType, user: { id: string }) => {
    const { name, imageUrl, description, marketId, categoryIds, products, bank } = data;

    const validStoreCategoryIds = await prisma.category.count({
        where: {
            id: {in: (categoryIds || []) }
        }
    })

    if(categoryIds && validStoreCategoryIds !== categoryIds.length) {
        throw new Error("invalid store categories selected");
    }

    if(await prisma.market.count({ where: { id: marketId } }) === 0) {
        throw new Error("invalid market selected");
    }

    if(await prisma.bank.count({ where: { id: bank.bankId } }) == 0) {
        throw new Error("invalid bank selected");
    }

    const validProductCategories = await prisma.category.count({
        where: {
            id: { in: products?.map((p) => p.categoryId) || [] }
        }
    });

    if(products && validProductCategories !== products.length) {
        throw new Error("invalid product categories selected");
    }


    return await prisma.$transaction(async (tx) => {
        

        const store = await tx.store.create({
            data: {
                name,
                imageUrl,
                description,
                marketId,
                ownerId: parseInt(user.id),
                categories: categoryIds ? { connect: categoryIds.map((id: number) => ({ id })) } : undefined,
            },
        });

        if (products) {
            await tx.product.createMany({
                data: products.map((product: CreateProductSchemaType)  => ({
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

        return store;
    });
}