import { prisma } from "@/config/database";
import { ApiError } from "@/utils/ApiError";
import { Role, User } from "@prisma/client";

export const createUserWallet = async (user: User) => {
    if (user.role === Role.SELLER) {
        const store = await prisma.store.findFirst({ where: { ownerId: user.id } })
        if (!store)
            throw ApiError.notFound('seller store not found')

        const walletExist = !!await prisma.sellerWallet.findFirst({ where: { storeId: store.id } });


        if (!walletExist) {
            await prisma.sellerWallet.create({
                data: {
                    storeId: store.id
                }
            })
            return;
        }
    }

    if (user.role === Role.BUYER) {
        if (!!await prisma.userWallet.findFirst({ where: {userId: user.id} })) return

        await prisma.userWallet.create({
            data: {
                userId: user.id
            }
        })
    }
}