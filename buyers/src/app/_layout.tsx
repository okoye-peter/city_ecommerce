import * as ExpoSplashScreen from 'expo-splash-screen'
import { Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Provider } from 'react-redux'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter'
import SplashScreen from '@/components/SplashScreen'
import { store } from '@/store'
import { initializeAuth } from '@/store/slices/authSlice'
import { setSessionExpiredHandler } from '@/libs/axios'
import { clearCredentials } from '@/store/slices/authSlice'
import '../../global.css'
import Toast from 'react-native-toast-message';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ExpoSplashScreen.preventAutoHideAsync()

const SPLASH_MIN_MS = 2500

function RootLayoutInner() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    Inter_600SemiBold,
  })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Register the session-expired handler so the axios interceptor can
    // clear state when a refresh token fails.
    setSessionExpiredHandler(async () => {
      store.dispatch(clearCredentials())
    })

    // Hydrate auth state from storage before showing any screen.
    store.dispatch(initializeAuth())
  }, [])

  useEffect(() => {
    if (!fontsLoaded && !fontError) return
    const start = Date.now()
    ExpoSplashScreen.hideAsync().finally(() => {
      const remaining = Math.max(0, SPLASH_MIN_MS - (Date.now() - start))
      setTimeout(() => setReady(true), remaining)
    })
  }, [fontsLoaded, fontError])

  if (!ready) return <SplashScreen />

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { paddingTop: 0 } }} />
    </View>
  )
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootLayoutInner />
          <Toast/>
        </GestureHandlerRootView>
      </Provider>
    </QueryClientProvider>
  )
}
