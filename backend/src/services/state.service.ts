import { prisma } from "@/config/database";

export const getStates = async () => {
    const states = await prisma.state.findMany();
    return states
}