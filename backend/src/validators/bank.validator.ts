import z from "zod";

export const bankSchema = z.object({
    bankId: z.coerce.number().int().positive(),
    accountNumber: z.string().regex(/^\d{10}$/, "Account number must be exactly 10 digits"),
})