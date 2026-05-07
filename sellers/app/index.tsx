import { Redirect } from "expo-router";
import { useAuthStore, selectAuthStatus } from "@/src/features/auth/store/authStore";

export default function Index() {
    const status = useAuthStore(selectAuthStatus)

    // Root layout waits for initializeAuth before rendering routes,
    // so idle/loading should never be seen here — but guard anyway.
    if (status === 'idle' || status === 'loading') return null

    if (status === 'authenticated') {
        return <Redirect href="/(auth)/(tabs)/HomeScreen" />
    }

    return <Redirect href="/(guest)/SignInScreen" />
}
