import { z } from "zod";

export const bankSchema = z.object({
    bankId: z.string().min(1, "Bank is required"),
    accountNumber: z.string().regex(/^\d{10}$/, "Account number must be exactly 10 digits"),
})

export type bankSchemaType = z.infer<typeof bankSchema>;