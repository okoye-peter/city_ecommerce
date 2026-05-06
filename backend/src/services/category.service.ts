import { prisma } from "@/config/database";

export const getAllCategories = async () => {
    const categories = await prisma.category.findMany();
    return categories;
}