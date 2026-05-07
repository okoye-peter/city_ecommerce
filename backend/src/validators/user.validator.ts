import { z } from "zod";

export const verifyUserIdentitySchema = z.object({
    body: z.object({
        verificationType: z.enum(['NATIONAL_ID', 'INTERNATIONAL_PASSPORT', 'DRIVERS_LICENSE']),
        verificationId: z.string().length(11, 'Verification ID must be exactly 11 digits').regex(/^\d{11}$/, 'Verification ID must contain only digits'),
    })
})