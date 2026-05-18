import {
    View, Text, Platform, Animated, PanResponder, StyleSheet,
    Dimensions, TextInput, Pressable,
    ScrollView
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Image } from 'expo-image'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import { clsx } from 'clsx'
import CustomButton from '@/components/ui/CustomButton'
import CustomKeyboardAvoidingView from '@/components/ui/CustomKeyboardAvoidingView'
import { useRegisterMutation } from '@/store/api/authApi'
import { isAxiosError } from 'axios';
import Toast from 'react-native-toast-message';
import { signUpSchema } from '@/features/auth/signUpSchema';
import LoadingModal from '@/components/ui/LoadingModal';

const { height: SCREEN_HEIGHT } = Dimensions.get('window')
const SLIDE_INTERVAL = 4000
const SWIPE_THRESHOLD = 50

const slides = [
    require('@/assets/images/register_1.jpeg'),
    require('@/assets/images/register_2.jpeg'),
    require('@/assets/images/register_3.jpeg'),
]

const SignUpScreen = () => {
    const insets = useSafeAreaInsets()
    const router = useRouter()

    const [activeIndex, setActiveIndex] = useState(0)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [registerError, setRegisterError] = useState<Record<string, string>>({});
    const [register, { isLoading }] = useRegisterMutation()

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

    const handleRegistration = async () => {
        const result = signUpSchema.safeParse({
            name,
            email,
            password,
            confirmPassword
        });

        if(!result.success) {
            const fieldErrors: Record<string, string> = {};
            for (const issue of result.error.issues) {
                const key = issue.path[0] as string;
                if (key && !fieldErrors[key]) {
                    fieldErrors[key] = issue.message;
                }
            }
            setRegisterError(fieldErrors);
            return;
        }
        
        setRegisterError({});

        try {
            await register({ name, email, password, confirmPassword }).unwrap()
            Toast.show({
                type: 'success',
                text1: 'Registration Successful',
                text2: 'Am email verification code has been sent to your email'
            })
            router.replace('/(auth)/email_verifications/EmailVerificationScreen')
        } catch( error ) {
            console.log('errorrrrrr', {
                error,
                response: isAxiosError(error) ? error?.response?.data : 'not available'
            });
            const errorMessage = (error as any)?.data?.message ?? 'Something went wrong'

            Toast.show({
                type: 'error',
                text1: 'Registration failed',
                text2: errorMessage
            })
        }
    }



    return (
        <View className="flex-1">
            <StatusBar style="light" animated />

            <LoadingModal visible={isLoading} text='processing registration' />

            {/* Image Slider — fixed, unaffected by keyboard */}
            <View style={{ height: SCREEN_HEIGHT * 0.3 }} {...panResponder.panHandlers}>
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


            <CustomKeyboardAvoidingView>
                {/* Card */}
                <ScrollView
                    className="flex-1 bg-white rounded-t-[28px] -mt-7"
                    contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: insets.bottom + 24 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text className={clsx('font-Inter-Bold text-primary mb-1.5', Platform.OS === 'ios' ? 'text-[26px]' : 'text-[28px]')}>
                        Create account
                    </Text>
                    <Text className="text-base text-gray-500 font-Inter mb-7">
                        Join thousands of shoppers on City Commerce
                    </Text>

                    {/* Full Name */}
                    <View className="flex-row items-center bg-light rounded-[14px] px-4 h-14 mb-3.5">
                        <Ionicons name="person-outline" size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
                        <TextInput
                            className="flex-1 text-base font-Inter text-primary"
                            placeholder="Full name"
                            placeholderTextColor="#9CA3AF"
                            autoCapitalize="words"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                    {registerError?.name && <Text className='mb-1.5 text-sm text-red-600'>{registerError?.name}</Text>}

                    {/* Email */}
                    <View className="flex-row items-center bg-light rounded-[14px] px-4 h-14 mb-3.5">
                        <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
                        <TextInput
                            className="flex-1 text-base font-Inter text-primary"
                            placeholder="Email address"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                    {registerError?.email && <Text className='mb-1.5 text-sm text-red-600'>{registerError?.email}</Text>}

                    {/* Password */}
                    <View className="flex-row items-center bg-light rounded-[14px] px-4 h-14 mb-3.5">
                        <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
                        <TextInput
                            className="flex-1 text-base font-Inter text-primary"
                            placeholder="Password"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <Pressable onPress={() => setShowPassword(v => !v)} hitSlop={8}>
                            <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#9CA3AF" />
                        </Pressable>
                    </View>
                    {registerError?.password && <Text className='text-sm text-red-600 mb-1.5'>{registerError?.password}</Text>}

                    {/* Confirm Password */}
                    <View className="flex-row items-center bg-light rounded-[14px] px-4 h-14 mb-7">
                        <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
                        <TextInput
                            className="flex-1 text-base font-Inter text-primary"
                            placeholder="Confirm password"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry={!showConfirmPassword}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                        <Pressable onPress={() => setShowConfirmPassword(v => !v)} hitSlop={8}>
                            <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#9CA3AF" />
                        </Pressable>
                    </View>
                    {registerError?.confirmPassword && <Text className='text-sm text-red-600 mb-1.5'>{registerError?.confirmPassword}</Text>}

                    <CustomButton
                        buttonText="Create Account"
                        isLoading={isLoading}
                        disabled={isLoading}
                        onPressHandler={handleRegistration}
                    />

                    {/* Or divider */}
                    <View className="flex-row items-center my-5">
                        <View className="flex-1 h-px bg-gray-200" />
                        <Text className="font-Inter text-sm text-gray-400 mx-3.5">or</Text>
                        <View className="flex-1 h-px bg-gray-200" />
                    </View>

                    {/* Google */}
                    <Pressable
                        className="flex-row items-center justify-center gap-3 border-[1.5px] border-gray-200 rounded-full py-[15px]"
                        onPress={() => { }}
                    >
                        <AntDesign name="google" size={20} color="#1E1E1E" />
                        <Text className={clsx('font-Inter-SemiBold text-primary text-base')}>
                            Continue with Google
                        </Text>
                    </Pressable>

                    {/* Footer */}
                    <View className="flex-row items-center justify-center mt-6">
                        <Text className="text-base text-gray-500 font-Inter">Already have an account? </Text>
                        <Pressable onPress={() => router.back()}>
                            <Text className="text-base font-Inter-SemiBold text-primary">Sign in</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </CustomKeyboardAvoidingView>
        </View>
    )
}

export default SignUpScreen
