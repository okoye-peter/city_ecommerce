import { z } from "zod";

export const withdrawalBodySchema = z.object({
    amount: z.number().nonnegative('Amount must be a non-negative number').min(1, 'Amount must be at least 1'),
    bankAccountId: z.string().nonempty('Bank account ID is required')
})

export const withdrawalSchema = z.object({
    body: withdrawalBodySchema,
})
    

export type withdrawalSchemaType = z.infer<typeof withdrawalBodySchema>;