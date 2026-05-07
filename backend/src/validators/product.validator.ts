import z from "zod";


export const productSchema = z.object({
    name: z.string().max(255),
    description: z.string().max(1000).optional(),
    price: z.coerce.number().nonnegative(),
    isAvailable: z.coerce.boolean(),
    categoryId: z.coerce.number(),
    imageUrl: z.string().url(),
})

export type CreateProductSchemaType = z.infer<typeof productSchema>;