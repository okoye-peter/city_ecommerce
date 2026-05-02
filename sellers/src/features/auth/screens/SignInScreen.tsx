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
    runOnJS,
    Easing,
} from 'react-native-reanimated'
import LoadingOverlay from '@/src/components/ui/LoadingOverlay'
import CustomButton from '@/src/components/ui/CustomButton'
import CustomInput from '@/src/components/ui/CustomInput'
import { Feather } from '@expo/vector-icons'

const SLIDES = [
    {
        image: require('@/assets/images/signin/home_screen.jpg'),
        icon: 'trending-up' as const,
        title: 'Grow Your Business',
        subtitle: 'List products and reach thousands of local customers in your city.',
    },
    {
        image: require('@/assets/images/home_screen/offline-shop-icon.jpg'),
        icon: 'package' as const,
        title: 'Manage With Ease',
        subtitle: 'Track orders, manage inventory, and monitor earnings in one place.',
    },
    {
        image: require('@/assets/images/Post by 3000LABELS DIRECT.jpeg'),
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
    }, [isActive])

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
    }, [isActive])

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

    const textOpacity = useSharedValue(1)
    const textX = useSharedValue(0)

    const animateToSlide = (next: number) => {
        textOpacity.value = withTiming(0, { duration: 240, easing: Easing.out(Easing.ease) }, (done) => {
            if (done) {
                runOnJS(setActiveSlide)(next)
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
    }, [activeSlide])

    const textAnimStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [{ translateX: textX.value }],
    }))

    const slide = SLIDES[activeSlide]
    const inactivePadding = Math.max(insets.bottom, 24)


    const handleSignIn = () => { router.replace("../(auth)/IdentityVerification/VerifyIdentityScreen") }


    return (
        <>
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
                    behavior="position"
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? -30 : -40}
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
                                <View style={{ flexDirection: 'row', gap: 6, marginTop: 26 }}>
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
                                            marginBottom: 6,
                                        }}
                                    >
                                        Welcome back
                                    </Text>
                                    <Text
                                        style={{
                                            color: '#6B7280',
                                            fontSize: Platform.OS === 'ios' ? 14 : 15,
                                            lineHeight: 22,
                                            marginBottom: 22,
                                        }}
                                    >
                                        Sign in to manage your store and reach your customers.
                                    </Text>

                                    <CustomInput
                                        label="Email address"
                                        value={email}
                                        setValue={setEmail}
                                        placeholder="you@example.com"
                                        keyboardType="email-address"
                                    />

                                    <CustomInput
                                        label="Password"
                                        value={password}
                                        setValue={setPassword}
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
                                        style={({ pressed }) => ({
                                            opacity: pressed ? 0.8 : 1,
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
