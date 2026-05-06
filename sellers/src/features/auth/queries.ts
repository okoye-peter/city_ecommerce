import { useMutation } from '@tanstack/react-query'
import { registerUser, signIn, googleSignIn, sendResetCode, verifyOtp, resetPassword, sendEmailVerification, verifyEmail, getAuthUser } from './api'
import { useAuthStore } from './store/authStore'

export const useRegister = () =>
    useMutation({ mutationFn: registerUser })

export const useSignIn = () => {
    const setSession = useAuthStore(s => s.setSession)
    return useMutation({
        mutationFn: signIn,
        onSuccess: async (data) => {
            console.log('SignIn successful, setting session with data:', data)
            await setSession(data)
        }
    })
}

export const useGoogleSignIn = () => {
    const setSession = useAuthStore(s => s.setSession)
    return useMutation({
        mutationFn: googleSignIn,
        onSuccess: async (data) => {
            await setSession(data)
        },
    })
}

export const useSendResetCode = () =>
    useMutation({ mutationFn: sendResetCode })

export const useVerifyOtp = () =>
    useMutation({
        mutationFn: ({ email, otp }: { email: string; otp: string }) =>
            verifyOtp(email, otp),
    })

export const useResetPassword = () =>
    useMutation({
        mutationFn: ({ email, otp, password }: { email: string; otp: string; password: string }) =>
            resetPassword(email, otp, password),
    })

export const useSendEmailVerification = () =>
    useMutation({ mutationFn: sendEmailVerification })

export const useVerifyEmail = () =>{
    const setSession = useAuthStore(s => s.setSession)
    return useMutation({
        mutationFn: ({ email, otp }: { email: string; otp: string }) =>
            verifyEmail(email, otp),
        onSuccess: (data) => setSession(data.data)
    })
}

export const useGetAuthUser = () => {
    const setUser = useAuthStore(s => s.setUser)
    return useMutation({
        mutationFn: () => getAuthUser(),
        onSuccess: async(data) => {
            console.log('useGetAuthUser', data)
            await setUser(data)
        },
        mutationKey: ['authUser']
    })
}
