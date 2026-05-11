import React, { useEffect, useRef } from 'react'
import { Stack, useSegments, useRouter } from 'expo-router'
import { useAuthStore, selectUser, selectStore } from '@/src/features/auth/store/authStore'

const AuthRootLayout = () => {
    const router = useRouter()
    // const logout = useAuthStore(s => s.logout);
    // logout();
    // router.replace('/(guest)/SignInScreen');
    const user = useAuthStore(selectUser)
    const store = useAuthStore(selectStore)
    const segments = useSegments()
    

    const segmentsRef = useRef(segments)
    segmentsRef.current = segments

    useEffect(() => {
        const segs = segmentsRef.current
        const onIdentityFlow = segs.some((s: string) => s === 'IdentityVerification')
        const onStoreSetup = segs.some((s: string) => s === 'Shops')

        if (!user) {
            router.replace('/(guest)/SignInScreen')
            return
        }
        if (!user.isVerified) {
            router.replace({ pathname: '/(guest)/EmailVerificationScreen', params: { email: user.email } })
            return
        }
        const needsIdentity = !user.verificationType || !user.verificationId
        if (needsIdentity && !onIdentityFlow) {
            router.replace('/(auth)/IdentityVerification/VerifyIdentityScreen')
            return
        }
        if (!store && !onStoreSetup && !needsIdentity) {
            router.replace('/(auth)/Shops/StoreSetupScreen')
        }
    }, [user, store, router])

    return <Stack screenOptions={{ headerShown: false }} />
}

export default AuthRootLayout
