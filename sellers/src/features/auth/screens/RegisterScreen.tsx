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
    withSpring,
    runOnJS,
    Easing,
} from 'react-native-reanimated'
import LoadingOverlay from '@/src/components/ui/LoadingOverlay'
import CustomButton from '@/src/components/ui/CustomButton'
import CustomInput from '@/src/components/ui/CustomInput'
import { Feather } from '@expo/vector-icons'

type Step = 1 | 2

const getPasswordStrength = (pw: string): number => {
    if (!pw) return 0
    let s = 0
    if (pw.length >= 8) s++
    if (/[A-Z]/.test(pw)) s++
    if (/[0-9]/.test(pw)) s++
    if (/[^A-Za-z0-9]/.test(pw)) s++
    return s
}

const STRENGTH_COLORS = ['#E5E7EB', '#EF4444', '#F59E0B', '#22C55E', '#22C55E']
const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong']

const PasswordStrength = ({ password }: { password: string }) => {
    const strength = getPasswordStrength(password)
    const color = STRENGTH_COLORS[strength]
    return (
        <View style={{ marginTop: -6, marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', gap: 4, marginBottom: 5 }}>
                {[1, 2, 3, 4].map((i) => (
                    <View
                        key={i}
                        style={{
                            flex: 1,
                            height: 3,
                            borderRadius: 2,
                            backgroundColor: i <= strength ? color : '#E5E7EB',
                        }}
                    />
                ))}
            </View>
            {password.length > 0 && (
                <Text style={{ fontSize: 11, color, fontWeight: '600' }}>
                    {STRENGTH_LABELS[strength]}
                </Text>
            )}
        </View>
    )
}

const Register = () => {
    const router = useRouter()
    const insets = useSafeAreaInsets()

    const [step, setStep] = useState<Step>(1)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Card springs up from bottom on mount
    const cardY = useSharedValue(360)
    const cardOpacity = useSharedValue(0)

    useEffect(() => {
        cardOpacity.value = withTiming(1, { duration: 300 })
        cardY.value = withSpring(0, { damping: 22, stiffness: 160 })
    }, [cardOpacity, cardY])

    // Step content cross-fade + slide
    const contentOpacity = useSharedValue(1)
    const contentX = useSharedValue(0)

    const animateToStep = (next: Step) => {
        contentOpacity.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.ease) }, (done) => {
            if (done) {
                runOnJS(setStep)(next)
                contentX.value = 24
                contentOpacity.value = withTiming(1, { duration: 320, easing: Easing.out(Easing.ease) })
                contentX.value = withTiming(0, { duration: 320, easing: Easing.out(Easing.ease) })
            }
        })
    }

    const cardAnimStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: cardY.value }],
        opacity: cardOpacity.value,
    }))

    const contentAnimStyle = useAnimatedStyle(() => ({
        opacity: contentOpacity.value,
        transform: [{ translateX: contentX.value }],
    }))

    const handleBack = () => {
        if (step > 1) {
            animateToStep(1)
        } else {
            router.back()
        }
    }

    return (
        <>
            <View style={{ flex: 1, backgroundColor: '#000' }}>
                <StatusBar style="light" />

                {/* Background */}
                <Image
                    source={require('@/assets/images/shop_setup/styled-shop.jpg')}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                    transition={400}
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.62)', 'rgba(0,0,0,0.22)', 'rgba(0,0,0,0.52)']}
                    locations={[0, 0.42, 1]}
                    style={StyleSheet.absoluteFill}
                />

                {/* Back button */}
                <Pressable
                    onPress={handleBack}
                    style={({ pressed }) => ({
                        position: 'absolute',
                        top: insets.top + 14,
                        left: 24,
                        zIndex: 10,
                        opacity: pressed ? 0.75 : 1,
                        width: 42,
                        height: 42,
                        borderRadius: 21,
                        backgroundColor: 'rgba(255,255,255,0.18)',
                        alignItems: 'center',
                        justifyContent: 'center',
                    })}
                >
                    <Feather name="arrow-left" size={20} color="white" />
                </Pressable>

                {/* Hero text — visible above the card */}
                <View
                    style={{
                        position: 'absolute',
                        top: insets.top + 72,
                        left: 30,
                        right: 30,
                    }}
                >
                    <View
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 16,
                            backgroundColor: 'rgba(255,255,255,0.16)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 16,
                        }}
                    >
                        <Feather name="shopping-bag" size={22} color="white" />
                    </View>
                    <Text
                        style={{
                            color: 'white',
                            fontSize: Platform.OS === 'ios' ? 28 : 30,
                            fontWeight: '700',
                            letterSpacing: -0.5,
                            marginBottom: 8,
                        }}
                    >
                        Start selling today
                    </Text>
                    <Text
                        style={{
                            color: 'rgba(255,255,255,0.68)',
                            fontSize: Platform.OS === 'ios' ? 14 : 15,
                            lineHeight: 22,
                        }}
                    >
                        Join thousands of sellers on City Commerce.
                    </Text>
                </View>

                <KeyboardAvoidingView
                    behavior="position"
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? -30 : -40}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 1 }} />

                            {/* Animated form card */}
                            <Animated.View
                                style={[
                                    {
                                        backgroundColor: 'white',
                                        borderTopLeftRadius: 38,
                                        borderTopRightRadius: 38,
                                        paddingHorizontal: 30,
                                        paddingTop: 28,
                                        paddingBottom: Math.max(insets.bottom, 24),
                                        maxHeight: '76%',
                                    },
                                    cardAnimStyle,
                                ]}
                            >
                                {/* Card header with step indicator */}
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'flex-start',
                                        justifyContent: 'space-between',
                                        marginBottom: 22,
                                    }}
                                >
                                    <View>
                                        <Text
                                            style={{
                                                fontSize: Platform.OS === 'ios' ? 21 : 23,
                                                fontWeight: '700',
                                                color: '#1E1E1E',
                                                letterSpacing: -0.4,
                                            }}
                                        >
                                            {step === 1 ? 'Your details' : 'Secure your account'}
                                        </Text>
                                        <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 3 }}>
                                            Step {step} of 2
                                        </Text>
                                    </View>

                                    {/* Progress dots */}
                                    <View style={{ flexDirection: 'row', gap: 5, marginTop: 6 }}>
                                        {([1, 2] as Step[]).map((s) => (
                                            <View
                                                key={s}
                                                style={{
                                                    width: step === s ? 22 : 7,
                                                    height: 7,
                                                    borderRadius: 4,
                                                    backgroundColor: step === s ? '#1E1E1E' : '#E5E7EB',
                                                }}
                                            />
                                        ))}
                                    </View>
                                </View>

                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    keyboardShouldPersistTaps="handled"
                                    keyboardDismissMode="on-drag"
                                    contentContainerStyle={{ flexGrow: 1 }}
                                >
                                    <Animated.View style={contentAnimStyle}>

                                        {/* ── Step 1: Name & Email ── */}
                                        {step === 1 && (
                                            <>
                                                <View style={{ flexDirection: 'row', gap: 12 }}>
                                                    <View style={{ flex: 1 }}>
                                                        <CustomInput
                                                            label="First name"
                                                            value={firstName}
                                                            setValue={setFirstName}
                                                            placeholder="John"
                                                        />
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <CustomInput
                                                            label="Last name"
                                                            value={lastName}
                                                            setValue={setLastName}
                                                            placeholder="Doe"
                                                        />
                                                    </View>
                                                </View>

                                                <CustomInput
                                                    label="Email address"
                                                    value={email}
                                                    setValue={setEmail}
                                                    placeholder="you@example.com"
                                                    keyboardType="email-address"
                                                />

                                                <CustomButton
                                                    onPressHandler={() => animateToStep(2)}
                                                    buttonText="Continue"
                                                    classStyle="mt-2"
                                                />

                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        gap: 12,
                                                        marginVertical: 18,
                                                    }}
                                                >
                                                    <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
                                                    <Text style={{ color: '#9CA3AF', fontSize: 12 }}>or sign up with</Text>
                                                    <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
                                                </View>

                                                <Pressable
                                                    style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                                                    className="flex-row items-center justify-center gap-1.5 py-3 border border-gray-300 rounded-full"
                                                >
                                                    <View className="w-8 h-8">
                                                        <Image
                                                            source={require('@/assets/images/google_icon.png')}
                                                            contentFit="cover"
                                                            style={{ width: '100%', height: '100%' }}
                                                        />
                                                    </View>
                                                    <Text style={{ color: '#1E1E1E', fontSize: Platform.OS === 'ios' ? 15 : 16 }}>
                                                        Continue with Google
                                                    </Text>
                                                </Pressable>
                                            </>
                                        )}

                                        {/* ── Step 2: Password ── */}
                                        {step === 2 && (
                                            <>
                                                <CustomInput
                                                    label="Password"
                                                    value={password}
                                                    setValue={setPassword}
                                                    placeholder="Min. 8 characters"
                                                    secureTextEntry={!showPassword}
                                                    suffix={
                                                        <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                                                            <Feather
                                                                name={showPassword ? 'eye' : 'eye-off'}
                                                                size={18}
                                                                color="#A9A9A9"
                                                            />
                                                        </Pressable>
                                                    }
                                                />

                                                <PasswordStrength password={password} />

                                                <CustomInput
                                                    label="Confirm password"
                                                    value={confirmPassword}
                                                    setValue={setConfirmPassword}
                                                    placeholder="Re-enter your password"
                                                    secureTextEntry={!showConfirmPassword}
                                                    suffix={
                                                        <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} hitSlop={8}>
                                                            <Feather
                                                                name={showConfirmPassword ? 'eye' : 'eye-off'}
                                                                size={18}
                                                                color="#A9A9A9"
                                                            />
                                                        </Pressable>
                                                    }
                                                />

                                                <CustomButton
                                                    onPressHandler={() => {}}
                                                    buttonText="Create account"
                                                    classStyle="mt-2"
                                                />
                                            </>
                                        )}

                                        {/* Sign-in link */}
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginTop: 20,
                                            }}
                                        >
                                            <Text style={{ color: '#6B7280', fontSize: 13 }}>
                                                Already have an account?{' '}
                                            </Text>
                                            <Pressable
                                                onPress={() => router.back()}
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
                                                    Sign in
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
                                                By creating an account you agree to our{' '}
                                                <Text style={{ textDecorationLine: 'underline' }}>Terms & Conditions</Text>
                                                {' '}and{' '}
                                                <Text style={{ textDecorationLine: 'underline' }}>Privacy Policy</Text>.
                                            </Text>
                                        </View>
                                    </Animated.View>
                                </ScrollView>
                            </Animated.View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </View>

            <LoadingOverlay isVisible={false} />
        </>
    )
}

export default Register
