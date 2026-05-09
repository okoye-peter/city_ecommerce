import { z } from 'zod'

export const editStoreSchema = z.object({
    name: z.string().min(1, 'Shop name is required'),
    description: z.string().max(160, 'Description must be 160 characters or less'),
    marketId: z.string().min(1, 'Please select a market'),
    categoryIds: z.array(z.string()).min(1, 'Select at least one category'),
    openDays: z.array(z.string()).min(1, 'Select at least one open day'),
    openingTime: z.string(),
    closingTime: z.string(),
})

export type EditStoreFormData = z.infer<typeof editStoreSchema>
