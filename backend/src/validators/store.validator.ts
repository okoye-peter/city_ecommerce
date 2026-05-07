import z from "zod";
import { productSchema } from "./product.validator";
import { bankSchema } from "./bank.validator";

export const createStoreSchema = z.object({
  body: z.object({
    name: z.string().max(255),
    imageUrl: z.string().url(),
    description: z.string().max(1000).optional(),
    marketId: z.coerce.number().int().positive(),
    categoryIds: z.array(z.coerce.number().int().positive()).optional(),
    products: z.array(productSchema).optional(),
    bank: bankSchema
  }),
});


export type CreateStoreSchemaType = z.infer<typeof createStoreSchema>["body"];