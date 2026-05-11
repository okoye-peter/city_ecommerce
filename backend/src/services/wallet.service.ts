import { prisma } from "@/config/database";
import { ApiError } from "@/utils/ApiError";
import { generateUniqueId } from "@/utils/generator";
import { Role, User, Prisma, SellerWalletTransactionType, WalletTransactionType, WithdrawalStatus } from "@prisma/client";

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

export const getWallet = async (userId: string, role: Role) => {
    if(role === Role.SELLER){
        const wallet = await prisma.sellerWallet.findFirst({
            where: {
                store: {
                    ownerId: BigInt(userId)
                }
            }
        })
        if (!wallet) return null;
        return {
            ...wallet,
            availableBalance: Number(wallet.availableBalance),
            escrowBalance: Number(wallet.escrowBalance),
        }
    }

    if(role === Role.BUYER) {
        const wallet = await prisma.userWallet.findFirst({
            where: {
                userId: BigInt(userId)
            }
        })
        if (!wallet) return null;
        return {
            ...wallet,
            creditBalance: Number(wallet.creditBalance),
        }
    }
}

export const recordSellerTransaction = async (
    walletId: bigint,
    type: SellerWalletTransactionType,
    amount: number,
    opts: {
        description?: string;
        orderGroupId?: bigint;
        orderId?: bigint;
        productId?: bigint;
    } = {},
    tx?: Prisma.TransactionClient,
) => {
    const client = tx || prisma;
    return client.sellerWalletTransaction.create({
        data: { walletId, type, amount, ...opts },
    });
};

export const recordBuyerTransaction = async (
    walletId: bigint,
    type: WalletTransactionType,
    amount: number,
    opts: {
        description?: string;
        orderId?: bigint;
        orderGroupId?: bigint;
    } = {},
    tx?: Prisma.TransactionClient,
) => {
    const client = tx || prisma;
    return client.walletTransaction.create({
        data: { walletId, type, amount, ...opts },
    });
};

export interface TransactionFilters {
    from?: Date;
    to?: Date;
    refNo?: string;
    productName?: string;
    order?: 'asc' | 'desc';
}

export const getWalletTransactions = async (
    userId: string,
    role: Role,
    page = 1,
    limit = 20,
    filters: TransactionFilters = {},
) => {
    const skip = (page - 1) * limit;
    const { from, to, refNo, productName, order = 'desc' } = filters;

    const dateFilter = from || to
        ? { createdAt: { ...(from && { gte: from }), ...(to && { lte: to }) } }
        : {};

    if (role === Role.SELLER) {
        const wallet = await prisma.sellerWallet.findFirst({
            where: { store: { ownerId: BigInt(userId) } },
        });
        if (!wallet) throw ApiError.notFound("Seller wallet not found");

        const where: Prisma.SellerWalletTransactionWhereInput = {
            walletId: wallet.id,
            ...dateFilter,
        };

        const [transactions, total] = await prisma.$transaction([
            prisma.sellerWalletTransaction.findMany({
                where,
                orderBy: { createdAt: order },
                skip,
                take: limit,
                // include: {
                //     orderGroup: { select: { id: true, refNo: true, totalAmount: true } },
                //     order: { select: { id: true, quantity: true, unitPrice: true, totalPrice: true } },
                //     product: { select: { id: true, name: true, imageUrl: true } },
                // },
            }),
            prisma.sellerWalletTransaction.count({ where }),
        ]);

        return {
            transactions: transactions.map(t => ({
                ...t,
                amount: Number(t.amount),
            })),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }

    if (role === Role.BUYER) {
        const wallet = await prisma.userWallet.findFirst({
            where: { userId: BigInt(userId) },
        });
        if (!wallet) throw ApiError.notFound("Wallet not found");

        // Buyer product search spans two paths:
        // REFUND → order.product, PURCHASE_DEDUCTION → orderGroup.orders[].product
        const productFilter: Prisma.WalletTransactionWhereInput = productName
            ? {
                OR: [
                    { order: { product: { name: { contains: productName, mode: "insensitive" } } } },
                    { orderGroup: { orders: { some: { product: { name: { contains: productName, mode: "insensitive" } } } } } },
                ],
            }
            : {};

        const where: Prisma.WalletTransactionWhereInput = {
            walletId: wallet.id,
            ...dateFilter,
            ...(refNo && { orderGroup: { refNo: { contains: refNo, mode: "insensitive" } } }),
            ...productFilter,
        };

        const [transactions, total] = await prisma.$transaction([
            prisma.walletTransaction.findMany({
                where,
                orderBy: { createdAt: order },
                skip,
                take: limit,
                include: {
                    order: {
                        select: {
                            id: true,
                            quantity: true,
                            unitPrice: true,
                            totalPrice: true,
                            product: { select: { id: true, name: true, imageUrl: true } },
                        },
                    },
                    orderGroup: {
                        select: {
                            id: true,
                            refNo: true,
                            totalAmount: true,
                            orders: {
                                select: {
                                    id: true,
                                    quantity: true,
                                    unitPrice: true,
                                    totalPrice: true,
                                    product: { select: { id: true, name: true, imageUrl: true } },
                                },
                            },
                        },
                    },
                },
            }),
            prisma.walletTransaction.count({ where }),
        ]);

        return {
            transactions,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }

    throw ApiError.badRequest("Invalid role");
};

export const initiateWithdrawal = async (userId: string, role: Role, amount: number, bankAccountId: string) => {
    // TODO: Add transaction pin verification
    if(role === Role.SELLER){
        const wallet = await prisma.sellerWallet.findFirst({
            where: {
                store: {
                    ownerId: BigInt(userId)
                }
            }
        })

        if(!wallet) throw ApiError.notFound("Seller wallet not found")

        if(Number(wallet.availableBalance) < amount) throw ApiError.badRequest("Insufficient balance")

        return prisma.$transaction(async (tx) => {

            await tx.sellerWallet.update({
                where: {
                    id: wallet.id
                },
                data: {
                    availableBalance: Number(wallet.availableBalance) - amount
                }
            })
            const withdrawal = await tx.sellerWalletTransaction.create({
                data: {
                    walletId: wallet.id,
                    type: SellerWalletTransactionType.WITHDRAWAL,
                    amount: amount,
                    userBankId: BigInt(bankAccountId),
                    description: `Withdrawal of ${amount} to bank account`,
                    status: WithdrawalStatus.COMPLETED,
                    reference: "WDR-" + generateUniqueId(18)
                }
            })

            await tx.userBank.update({
                where: {
                    id: BigInt(bankAccountId)
                },
                data: {
                    isSelected: true
                }
            })

            return withdrawal
        });
    }

    throw ApiError.forbidden("Only sellers can withdraw from their wallet")
}

