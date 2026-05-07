import { prisma } from "@/config/database";
import { ApiError } from "@/utils/ApiError";
import { Role, User, Prisma } from "@prisma/client";

export const createUserWallet = async (
  user: User,
  tx?: Prisma.TransactionClient,
) => {
  const client = tx || prisma;
  if (user.role === Role.SELLER) {
    const store = await client.store.findFirst({ where: { ownerId: user.id } });
    if (!store) throw ApiError.notFound("seller store not found");

    const walletExist = !!(await client.sellerWallet.findFirst({
      where: { storeId: store.id },
    }));

    if (!walletExist) {
      await client.sellerWallet.create({
        data: {
          storeId: store.id,
        },
      });
      return;
    }
  }

  if (user.role === Role.BUYER) {
    if (!!(await client.userWallet.findFirst({ where: { userId: user.id } })))
      return;

    await client.userWallet.create({
      data: {
        userId: user.id,
      },
    });
  }
};
