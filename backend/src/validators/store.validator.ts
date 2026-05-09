import z from "zod";
import { productSchema } from "./product.validator";
import { bankSchema } from "./bank.validator";

const dayEnum = z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']);

export const createStoreSchema = z.object({
  body: z.object({
    name: z.string().max(255),
    imageUrl: z.string().url(),
    description: z.string().max(1000).optional(),
    marketId: z.coerce.number().int().positive(),
    categoryIds: z.array(z.coerce.number().int().positive()).optional(),
    products: z.array(productSchema).optional(),
    bank: bankSchema,
    openDays: z.array(dayEnum).optional(),
    openingTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    closingTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  }),
});


export type CreateStoreSchemaType = z.infer<typeof createStoreSchema>["body"];

export const updateStoreSchema = z.object({
  body: z.object({
    name: z.string().max(255).optional(),
    imageUrl: z.string().url().optional(),
    description: z.string().max(1000).optional(),
    marketId: z.coerce.number().int().positive().optional(),
    categoryIds: z.array(z.coerce.number().int().positive()).optional(),
    openDays: z.array(dayEnum).optional(),
    openingTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    closingTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  }),
});

export type UpdateStoreSchemaType = z.infer<typeof updateStoreSchema>["body"];