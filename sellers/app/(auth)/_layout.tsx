import React from 'react'
import { Stack, Redirect, useSegments } from 'expo-router'
import { useAuthStore, selectUser, selectStore } from '@/src/features/auth/store/authStore'



const AuthRootLayout = () => {
    // const logout = useAuthStore(s => s.logout)
    // logout()
    const user = useAuthStore(selectUser)
    const store = useAuthStore(selectStore)
    const segments = useSegments()
    

    if (!user) return <Redirect href="/(guest)/SignInScreen" />

    if (!user.isVerified) {
        return <Redirect href={{ pathname: '/(guest)/EmailVerificationScreen', params: { email: user.email } }} />
    }

    const needsIdentity = !user.verificationType || !user.verificationId
    const onIdentityFlow = segments.some((s: string) => s === 'IdentityVerification')

    if (needsIdentity && !onIdentityFlow) {
        return <Redirect href="/(auth)/IdentityVerification/VerifyIdentityScreen" />
    }

    const onStoreSetup = segments.some((s: string) => s === 'Shops')
    if (!store && !onStoreSetup) {
        return <Redirect href="/(auth)/Shops/StoreSetupScreen" />
    }

    return <Stack screenOptions={{ headerShown: false }} />
}

export default AuthRootLayout
