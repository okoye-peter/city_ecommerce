import { z } from "zod";

export const signUpSchema = z.object({
    name: z.string('enter you full name').min(3, 'name must be at least 3 characters').max(255),
    email: z.email(),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must include an uppercase letter')
        .regex(/[0-9]/, 'Must include a number'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
})

export type SignUpSchemaDataType = z.infer<typeof signUpSchema>;