import { prisma } from '../config/database';

export const fetchBanks = async () => {
    const banks = await prisma.bank.findMany();
    return banks;
}