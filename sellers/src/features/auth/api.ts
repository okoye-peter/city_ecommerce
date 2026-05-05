import api from '@/src/lib/axios'
import type { User } from './store/authStore'

export interface AuthTokens {
    accessToken: string
    refreshToken: string
}

export interface AuthResponse extends AuthTokens {
    user: User
}

export interface ApiResponse<T> {
    data: T
    message: string
    success: boolean
}

export interface RegisterPayload {
    firstName: string
    lastName: string
    email: string
    password: string
    passwordConfirmation: string
}

export type RegisterResponse = ApiResponse<{ email: string; message: string }>

export interface SignInPayload {
    email: string
    password: string
}

export const registerUser = (payload: RegisterPayload): Promise<RegisterResponse> =>
    api.post('/auth/register', payload).then(r => r.data)

export const signIn = (payload: SignInPayload): Promise<AuthResponse> =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', payload).then(r => r.data.data)

export const sendResetCode = (email: string): Promise<ApiResponse<null>> =>
    api.post('/auth/forgot-password', { email }).then(r => r.data)

export const verifyOtp = (email: string, otp: string): Promise<ApiResponse<null>> =>
    api.post('/forgot-password/verify-otp', { email, otp }).then(r => r.data)

export const resetPassword = (email: string, otp: string, password: string): Promise<ApiResponse<null>> =>
    api.post('/auth/reset-password', { email, otp, password }).then(r => r.data)

export const sendEmailVerification = (email: string): Promise<ApiResponse<null>> =>
    api.post('/auth/resend-verification', { email }).then(r => r.data)

export const verifyEmail = (email: string, otp: string): Promise<ApiResponse<AuthResponse>> =>
    api.post('/auth/verify-email', { email, otp }).then(r => r.data)
