import api from '@/src/lib/axios'
import type { User, AuthResponse, ApiResponse, RegisterPayload, RegisterResponse, SignInPayload } from '@/src/types'

export type { AuthTokens, AuthResponse, ApiResponse, RegisterPayload, RegisterResponse, SignInPayload } from '@/src/types'

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

export const getAuthUser = (): Promise<User> =>
    api.get('/users/profile').then(r => r.data.data.user)

// Sends the Google-issued idToken to your backend. The backend verifies it with
// Google's public keys, then creates or fetches the user and returns your JWT pair.
export const googleSignIn = (idToken: string): Promise<AuthResponse> =>
    api.post<ApiResponse<AuthResponse>>('/auth/google', { idToken }).then(r => r.data.data)
