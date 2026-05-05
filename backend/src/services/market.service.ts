import { prisma } from '../config/database';


export const fetchMarkets = async () => {
    const markets = await prisma.market.findMany();
    return markets;
}