import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";
import CustomSplash from "@/src/components/ui/CustomSplash";
import "../global.css";
import { useFonts, Inter_400Regular, Inter_700Bold, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { initStorage } from "@/src/lib/storage";
import LoadingOverlay from "@/src/components/ui/LoadingOverlay";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

// Called once at module load — before any screen mounts.
// webClientId must be the Web OAuth client (not iOS/Android), because it identifies
// the server that will verify the idToken Google returns.
GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    scopes: ['profile', 'email'],
    offlineAccess: false,
})
import { useAuthStore } from '@/src/features/auth/store/authStore';
import { setSessionExpiredHandler } from '@/src/lib/axios';

const queryClient = new QueryClient();

// Prevent the native splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
        Inter_600SemiBold
    });

    const [isAppReady, setIsAppReady] = useState(false);
    const [showCustomSplash, setShowCustomSplash] = useState(true);

    useEffect(() => {
        async function prepare() {
            try {
                // Perform any initialization here (auth check, etc.)
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (e) {
                console.warn(e);
            } finally {
                // Wait for fonts to load or fail
                if (fontsLoaded || fontError) {
                    setIsAppReady(true);
                    await SplashScreen.hideAsync();
                }
            }
        }

        prepare();
    }, [fontsLoaded, fontError]);

    useEffect(() => {
        if (isAppReady) {
            // Show the custom splash for 3 seconds total
            const timer = setTimeout(() => {
                setShowCustomSplash(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isAppReady]);

    const [storageReady, setStorageReady] = useState(false);
    const [storageError, setStorageError] = useState(false);
    const initializeAuth = useAuthStore(s => s.initializeAuth);
    const logout = useAuthStore(s => s.logout);

    useEffect(() => {
        setSessionExpiredHandler(logout);
        initStorage()
            .then(() => initializeAuth())
            .then(() => setStorageReady(true))
            .catch((err) => {
                console.error('Failed to initialize secure storage:', err);
                setStorageError(true);
            });
    }, [initializeAuth, logout]);

    // Don't render anything until the native splash is ready to be replaced
    if (!isAppReady && !fontError) {
        return null;
    }

    if (storageError) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                    Unable to initialize secure storage. Please restart the app.
                </Text>
            </View>
        );
    }

    if (!storageReady) {
        return <LoadingOverlay isVisible />;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheetModalProvider>
                    <SafeAreaProvider>
                        <View style={{ flex: 1 }}>
                            <Stack screenOptions={{ headerShown: false }} />

                            {showCustomSplash && (
                                <Animated.View
                                    exiting={FadeOut.duration(800)}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        zIndex: 9999
                                    }}
                                >
                                    <CustomSplash />
                                </Animated.View>
                            )}
                        </View>
                    </SafeAreaProvider>
                </BottomSheetModalProvider>
            </GestureHandlerRootView>
            <Toast />
        </QueryClientProvider>
    );
}

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#cc0000',
    },
});
