import {
    View, Text, Platform, Animated, PanResponder, StyleSheet,
    Dimensions, TextInput, TouchableOpacity, ScrollView,
    Pressable,
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Image } from 'expo-image'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import { clsx } from 'clsx'
import CustomButton from '@/components/ui/CustomButton'
import LoadingModal from '@/components/ui/LoadingModal'
import CustomKeyboardAvoidingView from '@/components/ui/CustomKeyboardAvoidingView'
import { useLoginMutation } from '@/store/api/authApi'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')
const SLIDE_INTERVAL = 4000
const SWIPE_THRESHOLD = 50

const slides = [
    require('@/assets/images/sign_in_1.jpeg'),
    require('@/assets/images/sign_in_2.webp'),
    require('@/assets/images/sign_in_3.jpeg'),
]

const SignInScreen = () => {
    const insets = useSafeAreaInsets()
    const router = useRouter()

    const [activeIndex, setActiveIndex] = useState(0)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loginError, setLoginError] = useState<string | null>(null)
    const [login, { isLoading: loading }] = useLoginMutation()

    const activeIndexRef = useRef(0)
    const isAnimatingRef = useRef(false)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const imageOpacities = useRef(slides.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))).current

    const goToSlide = (newIndex: number) => {
        if (isAnimatingRef.current) return
        isAnimatingRef.current = true
        const current = activeIndexRef.current
        activeIndexRef.current = newIndex
        setActiveIndex(newIndex)
        Animated.parallel([
            Animated.timing(imageOpacities[current], { toValue: 0, duration: 600, useNativeDriver: true }),
            Animated.timing(imageOpacities[newIndex], { toValue: 1, duration: 600, useNativeDriver: true }),
        ]).start(() => { isAnimatingRef.current = false })
    }

    const goToSlideRef = useRef(goToSlide)
    goToSlideRef.current = goToSlide

    useEffect(() => {
        timerRef.current = setInterval(() => {
            goToSlideRef.current((activeIndexRef.current + 1) % slides.length)
        }, SLIDE_INTERVAL)
        return () => { if (timerRef.current) clearInterval(timerRef.current) }
    }, [])

    const panResponder = useRef(PanResponder.create({
        onMoveShouldSetPanResponder: (_, { dx, dy }) => Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10,
        onPanResponderRelease: (_, { dx }) => {
            if (dx < -SWIPE_THRESHOLD) {
                goToSlideRef.current((activeIndexRef.current + 1) % slides.length)
            } else if (dx > SWIPE_THRESHOLD) {
                goToSlideRef.current((activeIndexRef.current - 1 + slides.length) % slides.length)
            }
        },
    })).current


    const handleSignIn = async () => {
        setLoginError(null)
        try {
            await login({ email, password }).unwrap()
            router.replace('/(auth)/(tabs)/ExploreScreen')
        } catch {
            setLoginError('Invalid email or password. Please try again.')
        }
    }

    return (
        <View className="flex-1">
            <StatusBar style="light" animated />

            {/* Image Slider — fixed, unaffected by keyboard */}
            <View style={{ height: SCREEN_HEIGHT * 0.40 }} {...panResponder.panHandlers}>
                {slides.map((src, i) => (
                    <Animated.View key={i} style={[StyleSheet.absoluteFill, { opacity: imageOpacities[i] }]}>
                        <Image source={src} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                    </Animated.View>
                ))}

                {/* Back button */}
                <Pressable
                    onPress={() => router.back()}
                    className="absolute left-4 w-[38px] h-[38px] rounded-full bg-black/35 items-center justify-center"
                    style={{ top: insets.top + 8 }}
                >
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </Pressable>

                {/* Dots */}
                <View className="absolute bottom-11 left-0 right-0 flex-row justify-center items-center gap-1.5">
                    {slides.map((_, i) => (
                        <View
                            key={i}
                            className={clsx('h-2 rounded-full', i === activeIndex ? 'w-6 bg-white' : 'w-2 bg-white/45')}
                        />
                    ))}
                </View>
            </View>

            {/* KAV wraps only the card so the image never moves */}
            {/* Card */}
            <CustomKeyboardAvoidingView >
                <ScrollView
                    className="flex-1 bg-white rounded-t-[28px] -mt-7"
                    contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: insets.bottom + 24 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text className={clsx('font-Inter-Bold text-primary mb-1.5', Platform.OS === 'ios' ? 'text-[26px]' : 'text-[28px]')}>
                        Welcome back
                    </Text>
                    <Text className="text-base text-gray-500 font-Inter mb-7">
                        Sign in to your account to continue
                    </Text>

                    {/* Email */}
                    <View className="flex-row items-center bg-light rounded-[14px] px-4 h-14 mb-3.5">
                        <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
                        <TextInput
                            className="flex-1 font-Inter text-[15px] text-primary"
                            placeholder="Email address"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    {/* Password */}
                    <View className="flex-row items-center bg-light rounded-[14px] px-4 h-14 mb-3.5">
                        <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
                        <TextInput
                            className="flex-1 font-Inter text-[15px] text-primary"
                            placeholder="Password"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(v => !v)} hitSlop={8}>
                            <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    {/* Error message */}
                    {loginError && (
                        <Text className="text-red-500 text-sm font-Inter mb-3 -mt-1">{loginError}</Text>
                    )}

                    {/* Forgot Password */}
                    <TouchableOpacity
                        onPress={() => router.push('/(guest)/ForgotPasswordScreen')}
                        className="self-end mb-7"
                    >
                        <Text className="text-base font-Inter-SemiBold text-primary">Forgot password?</Text>
                    </TouchableOpacity>

                    <CustomButton buttonText="Sign In" onPressHandler={handleSignIn} />

                    {/* Or divider */}
                    <View className="flex-row items-center my-5">
                        <View className="flex-1 h-px bg-gray-200" />
                        <Text className="font-Inter text-[13px] text-gray-400 mx-3.5">or</Text>
                        <View className="flex-1 h-px bg-gray-200" />
                    </View>

                    {/* Google */}
                    <TouchableOpacity
                        className="flex-row items-center justify-center gap-3 border-[1.5px] border-gray-200 rounded-full py-[15px]"
                        activeOpacity={0.8}
                        onPress={() => { }}
                    >
                        <AntDesign name="google" size={20} color="#1E1E1E" />
                        <Text className={clsx('font-Inter-SemiBold text-primary text-base')}>
                            Continue with Google
                        </Text>
                    </TouchableOpacity>

                    {/* Footer */}
                    <View className="flex-row items-center justify-center mt-6">
                        <Text className="text-base text-gray-500 font-Inter">Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(guest)/SignUpScreen')}>
                            <Text className="text-base font-Inter-SemiBold text-primary">Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </CustomKeyboardAvoidingView>
            {/* </KeyboardAvoidingView> */}

            <LoadingModal visible={loading} />
        </View>
    )
}

export default SignInScreen
