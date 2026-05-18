import api from "@/libs/axios";
import { ApiResponse, AuthResponse, User } from "@/types";

export const sendEmailVerification = (email: string): Promise<ApiResponse<null>> =>
    api.post('/auth/resend-verification', { email }).then(r => r.data)

export const verifyEmail = (email: string, otp: string): Promise<ApiResponse<AuthResponse>> =>
    api.post('/auth/verify-email', { email, otp }).then(r => r.data)

export const getAuthUser = (): Promise<User> =>
    api.get('/users/profile').then(r => r.data.data.user)
