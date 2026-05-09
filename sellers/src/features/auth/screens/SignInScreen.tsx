import {
    View,
    Text,
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    Pressable,
    StyleSheet,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'
import LoadingOverlay from '@/src/components/ui/LoadingOverlay'
import CustomButton from '@/src/components/ui/CustomButton'
import CustomInput from '@/src/components/ui/CustomInput'
import { Feather } from '@expo/vector-icons'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import { signInSchema } from '../authSchema'
import { useSignIn, useGoogleSignIn } from '../queries'
import Toast from 'react-native-toast-message'

const SLIDES = [
    {
        image: require('@/assets/images/signin/sign_in_1.jpg'),
        icon: 'trending-up' as const,
        title: 'Grow Your Business',
        subtitle: 'List products and reach thousands of local customers in your city.',
    },
    {
        image: require('@/assets/images/signin/sign_in_2.jpg'),
        icon: 'package' as const,
        title: 'Manage With Ease',
        subtitle: 'Track orders, manage inventory, and monitor earnings in one place.',
    },
    {
        image: require('@//assets/images/signin/sign_in_3.jpg'),
        icon: 'users' as const,
        title: 'Build Your Brand',
        subtitle: 'Connect with loyal customers and grow your store reputation.',
    },
]

// Animated carousel background image — fades in/out based on isActive prop
const CarouselImage = ({ source, isActive }: { source: any; isActive: boolean }) => {
    const opacity = useSharedValue(isActive ? 1 : 0)

    useEffect(() => {
        opacity.value = withTiming(isActive ? 1 : 0, {
            duration: 700,
            easing: Easing.out(Easing.ease),
        })
    }, [isActive, opacity])

    const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

    return (
        <Animated.View style={[StyleSheet.absoluteFill, animStyle]}>
            <Image source={source} style={StyleSheet.absoluteFill} contentFit="cover" />
        </Animated.View>
    )
}

// Pill dot with animated width
const Dot = ({ isActive, onPress }: { isActive: boolean; onPress: () => void }) => {
    const animWidth = useSharedValue(isActive ? 24 : 7)

    useEffect(() => {
        animWidth.value = withTiming(isActive ? 24 : 7, { duration: 300 })
    }, [isActive, animWidth])

    const animStyle = useAnimatedStyle(() => ({ width: animWidth.value }))

    return (
        <Pressable onPress={onPress} hitSlop={10}>
            <Animated.View
                style={[
                    {
                        height: 7,
                        borderRadius: 4,
                        backgroundColor: isActive ? 'white' : 'rgba(255,255,255,0.38)',
                    },
                    animStyle,
                ]}
            />
        </Pressable>
    )
}

const SignIn = () => {
    const router = useRouter()
    const insets = useSafeAreaInsets()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [activeSlide, setActiveSlide] = useState(0)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const { mutateAsync: signIn, isPending } = useSignIn()
    const { mutateAsync: googleSignIn, isPending: isGooglePending } = useGoogleSignIn()

    const textOpacity = useSharedValue(1)
    const textX = useSharedValue(0)

    const animateToSlide = (next: number) => {
        textOpacity.value = withTiming(0, { duration: 240, easing: Easing.out(Easing.ease) }, (done) => {
            if (done) {
                scheduleOnRN(setActiveSlide, next)
                textX.value = 20
                textOpacity.value = withTiming(1, { duration: 380, easing: Easing.out(Easing.ease) })
                textX.value = withTiming(0, { duration: 380, easing: Easing.out(Easing.ease) })
            }
        })
    }

    useEffect(() => {
        const timer = setInterval(() => {
            animateToSlide((activeSlide + 1) % SLIDES.length)
        }, 3600)
        return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSlide])

    const textAnimStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [{ translateX: textX.value }],
    }))

    const slide = SLIDES[activeSlide]
    const inactivePadding = Math.max(insets.bottom, 24)


    const handleGoogleSignIn = async () => {
        try {
            // On Android, confirms Google Play Services are available before proceeding.
            // This is a no-op on iOS but safe to call on both platforms.
            await GoogleSignin.hasPlayServices()

            const result = await GoogleSignin.signIn()

            // The SDK returns a discriminated union — always check `type` before
            // reading `data`. 'success' is the only case that has an idToken.
            if (result.type !== 'success') return

            // idToken can be null when Google omits it (e.g. cached sign-in on some
            // Android versions). Treat it the same as a non-success result.
            if (!result.data.idToken) return

            await googleSignIn(result.data.idToken)
            Toast.show({ type: 'success', text1: 'Login successful', text2: 'Welcome back!', swipeable: true })
            router.replace('/(auth)/(tabs)/HomeScreen')
        } catch (error: any) {
            // SIGN_IN_CANCELLED: user dismissed the picker — not an error, stay silent.
            // IN_PROGRESS: another sign-in is already running — ignore.
            // Any other code is a real failure worth surfacing.
            if (
                error.code === statusCodes.SIGN_IN_CANCELLED ||
                error.code === statusCodes.IN_PROGRESS
            ) return

            const message = error?.response?.data?.message ?? 'Google sign in failed. Please try again.'
            Toast.show({ type: 'error', text1: 'Sign In Error', text2: message, swipeable: true })
        }
    }

    const handleSignIn = async () => {
        const result = signInSchema.safeParse({ email, password })
        if (!result.success) {
            const fieldErrors: Record<string, string> = {}
            for (const issue of result.error.issues) {
                const key = issue.path[0] as string
                if (!fieldErrors[key]) fieldErrors[key] = issue.message
            }
            setErrors(fieldErrors)
            return
        }
        setErrors({})

        try {
            await signIn({ email, password })
            Toast.show({
                type: 'success',
                text1: 'Login successful',
                text2: 'Welcome back!',
                swipeable: true,
            })
            router.replace('/(auth)/(tabs)/HomeScreen')
        } catch (error: any) {
            console.log('sign in error', {
                error,
                response: error?.response
            })
            const message = error?.response?.data?.message ?? 'Sign in failed. Please try again.'
            Toast.show({
                type: 'error',
                text1: 'Sign In Error',
                text2: message,
                swipeable: true,
            })
        }
    }


    return (
        <>
            <LoadingOverlay isVisible={isPending || isGooglePending} />
            <View style={{ flex: 1, backgroundColor: '#000' }}>
                <StatusBar style="light" />

                {/* Full-screen cross-fading carousel images */}
                {SLIDES.map((s, i) => (
                    <CarouselImage key={i} source={s.image} isActive={activeSlide === i} />
                ))}

                {/* Gradient — dark at bottom where form lives */}
                <LinearGradient
                    colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.92)']}
                    locations={[0, 0.38, 0.72]}
                    style={StyleSheet.absoluteFill}
                />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'position' : undefined}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flex: 1 }}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={{ flex: 1 }}>

                            {/* ── Carousel text area ── */}
                            <View
                                style={{
                                    flex: 1,
                                    paddingTop: insets.top + 32,
                                    paddingHorizontal: 30,
                                    justifyContent: 'center',
                                }}
                            >
                                <Animated.View style={textAnimStyle}>
                                    {/* Icon badge */}
                                    <View
                                        style={{
                                            width: 54,
                                            height: 54,
                                            borderRadius: 18,
                                            backgroundColor: 'rgba(255,255,255,0.16)',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: 20,
                                        }}
                                    >
                                        <Feather name={slide.icon} size={26} color="white" />
                                    </View>

                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: Platform.OS === 'ios' ? 30 : 32,
                                            fontWeight: '700',
                                            letterSpacing: -0.6,
                                            marginBottom: 10,
                                        }}
                                    >
                                        {slide.title}
                                    </Text>

                                    <Text
                                        style={{
                                            color: 'rgba(255,255,255,0.70)',
                                            fontSize: Platform.OS === 'ios' ? 15 : 16,
                                            lineHeight: 24,
                                        }}
                                    >
                                        {slide.subtitle}
                                    </Text>
                                </Animated.View>

                                {/* Dot indicators */}
                                <View style={{ flexDirection: 'row', gap: 6, marginTop: 26, marginBottom: 20 }}>
                                    {SLIDES.map((_, i) => (
                                        <Dot
                                            key={i}
                                            isActive={activeSlide === i}
                                            onPress={() => animateToSlide(i)}
                                        />
                                    ))}
                                </View>
                            </View>

                            {/* ── Form card ── */}
                            <View
                                style={{
                                    backgroundColor: 'white',
                                    borderTopLeftRadius: 38,
                                    borderTopRightRadius: 38,
                                    paddingHorizontal: 30,
                                    paddingTop: 30,
                                    paddingBottom: inactivePadding,
                                }}
                            >
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    keyboardShouldPersistTaps="handled"
                                    keyboardDismissMode="on-drag"
                                    contentContainerStyle={{ flexGrow: 1 }}
                                >
                                    <Text
                                        style={{
                                            fontSize: Platform.OS === 'ios' ? 22 : 24,
                                            fontWeight: '700',
                                            color: '#1E1E1E',
                                            letterSpacing: -0.5,
                                            marginBottom: 4,
                                        }}
                                    >
                                        Welcome back
                                    </Text>
                                    <Text
                                        style={{
                                            color: '#6B7280',
                                            fontSize: Platform.OS === 'ios' ? 12 : 14,
                                            lineHeight: 22,
                                            marginBottom: 10,
                                        }}
                                    >
                                        Sign in to manage your store and reach your customers.
                                    </Text>

                                    <CustomInput
                                        label="Email address"
                                        value={email}
                                        setValue={setEmail}
                                        error={errors.email}
                                        placeholder="you@example.com"
                                        keyboardType="email-address"
                                    />

                                    <CustomInput
                                        label="Password"
                                        value={password}
                                        setValue={setPassword}
                                        error={errors.password}
                                        placeholder="Enter your password"
                                        secureTextEntry={!showPassword}
                                        suffix={
                                            <Pressable
                                                onPress={() => setShowPassword(!showPassword)}
                                                hitSlop={8}
                                            >
                                                <Feather
                                                    name={showPassword ? 'eye' : 'eye-off'}
                                                    size={18}
                                                    color="#A9A9A9"
                                                />
                                            </Pressable>
                                        }
                                    />

                                    {/* Forgot password */}
                                    <Pressable
                                        onPress={() => router.push('/(guest)/ForgotPasswordScreen')}
                                        style={({ pressed }) => ({
                                            opacity: pressed ? 0.7 : 1,
                                            alignSelf: 'flex-end',
                                            marginTop: -8,
                                            marginBottom: 24,
                                        })}
                                        className='mb-3 ml-auto'
                                    >
                                        <Text
                                            style={{
                                                color: '#1E1E1E',
                                                fontSize: Platform.OS === 'ios' ? 13 : 14,
                                                fontWeight: '600',
                                                textDecorationLine: 'underline',
                                            }}
                                        >
                                            Forgot password?
                                        </Text>
                                    </Pressable>

                                    <CustomButton onPressHandler={handleSignIn} buttonText="Sign in" />

                                    {/* Divider */}
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 12,
                                            marginVertical: 18,
                                        }}
                                    >
                                        <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
                                        <Text style={{ color: '#9CA3AF', fontSize: 12 }}>or continue with</Text>
                                        <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
                                    </View>

                                    {/* Google */}
                                    <Pressable
                                        onPress={handleGoogleSignIn}
                                        disabled={isGooglePending}
                                        style={({ pressed }) => ({
                                            opacity: pressed || isGooglePending ? 0.6 : 1,
                                        })}
                                        className='flex-row items-center justify-center gap-1.5 py-3 border border-gray-300 rounded-full'
                                    >
                                        <View className='w-8 h-8'>

                                            <Image
                                                source={require('@/assets/images/google_icon.png')}
                                                contentFit='cover'
                                                style={{ width: '100%', height: '100%' }}
                                            />
                                        </View>
                                        <Text
                                            style={{
                                                color: '#1E1E1E',
                                                fontSize: Platform.OS === 'ios' ? 15 : 16,
                                            }}
                                        >
                                            Continue with Google
                                        </Text>
                                    </Pressable>

                                    {/* Register link */}
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginTop: 20,
                                        }}
                                    >
                                        <Text style={{ color: '#6B7280', fontSize: 13 }}>
                                            New to City Commerce?{' '}
                                        </Text>
                                        <Pressable
                                            onPress={() => router.push('/(guest)/RegisterScreen')}
                                            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                                        >
                                            <Text
                                                style={{
                                                    color: '#1E1E1E',
                                                    fontSize: 13,
                                                    fontWeight: '600',
                                                    textDecorationLine: 'underline',
                                                }}
                                            >
                                                Create account
                                            </Text>
                                        </Pressable>
                                    </View>

                                    {/* Terms */}
                                    <View style={{ marginTop: 14, marginBottom: 4, alignItems: 'center' }}>
                                        <Text
                                            style={{
                                                color: '#9CA3AF',
                                                fontSize: 12,
                                                textAlign: 'center',
                                                lineHeight: 18,
                                            }}
                                        >
                                            By continuing you agree to our{' '}
                                            <Text style={{ textDecorationLine: 'underline' }}>
                                                Terms & Conditions
                                            </Text>{' '}
                                            and{' '}
                                            <Text style={{ textDecorationLine: 'underline' }}>Privacy Policy</Text>.
                                        </Text>
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </View>

            <LoadingOverlay isVisible={false} />
        </>
    )
}

export default SignIn
