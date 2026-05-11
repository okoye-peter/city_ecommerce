import z from "zod";

export const initiateWithdrawalSchema = z.object({
    amount: z.number().positive('Amount must be greater than 0'),
    bankAccountId: z.string().min(1, "Bank account is required"),
});

export type InitiateWithdrawalParams = z.infer<typeof initiateWithdrawalSchema>;
