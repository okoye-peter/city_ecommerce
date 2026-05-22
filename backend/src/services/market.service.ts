import { prisma } from '../config/database';


export const fetchMarkets = async () => {
    const markets = await prisma.market.findMany();
    return markets;
}

export const getTop4MarketWithMostSellers = async (stateId?: string, limit?: number) => {
    
    const markets = await prisma.market.findMany({
        ...(stateId && { where: { stateId: BigInt(stateId as string) } }),
        select: {
            id: true,
            name: true,
            url: true,
            state: {
                select: { id: true, name: true },
            },
            _count: {
                select: { stores: true },
            },
        },
        orderBy: {
            stores: { _count: 'desc' },
        },
        ...(limit && { take: limit }),
    });
    return markets;
}