import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";
import CustomSplash from "../components/ui/common/CustomSplash";
import "../global.css";
import { useFonts, Inter_400Regular, Inter_700Bold, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

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

    // Don't render anything until the native splash is ready to be replaced
    if (!isAppReady && !fontError) {
        return null;
    }

    return (
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
    );
}
