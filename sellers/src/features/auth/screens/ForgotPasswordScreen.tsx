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
import { OtpInput } from 'react-native-otp-entry'

type Step = 1 | 2 | 3

const STEP_META: Record<Step, { icon: keyof typeof Feather.glyphMap; title: string; subtitle: string }> = {
    1: {
        icon: 'lock',
        title: 'Forgot password?',
        subtitle: "No worries — enter your registered email and we'll send you a 6-digit reset code.",
    },
    2: {
        icon: 'mail',
        title: 'Check your email',
        subtitle: "We've sent a 6-digit code to",
    },
    3: {
        icon: 'shield',
        title: 'New password',
        subtitle: "Create a strong password you haven't used before.",
    },
}

// Animated pill dot for the step indicator
const StepDot = ({ isActive }: { isActive: boolean }) => {
    const animWidth = useSharedValue(isActive ? 24 : 8)

    useEffect(() => {
        animWidth.value = withTiming(isActive ? 24 : 8, { duration: 300 })
    }, [isActive])

    const animStyle = useAnimatedStyle(() => ({ width: animWidth.value }))

    return (
        <Animated.View
            style={[
                {
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: isActive ? '#2C2C2C' : '#D9D9D9',
                },
                animStyle,
            ]}
        />
    )
}

const ForgotPassword = () => {
    const router = useRouter()
    const insets = useSafeAreaInsets()

    const [step, setStep] = useState<Step>(1)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const contentOpacity = useSharedValue(1)
    const contentX = useSharedValue(0)

    const animateToStep = (next: Step) => {
        contentOpacity.value = withTiming(0, { duration: 220, easing: Easing.out(Easing.ease) }, (done) => {
            if (done) {
                scheduleOnRN(setStep, next)
                contentX.value = 22
                contentOpacity.value = withTiming(1, { duration: 340, easing: Easing.out(Easing.ease) })
                contentX.value = withTiming(0, { duration: 340, easing: Easing.out(Easing.ease) })
            }
        })
    }

    const contentAnimStyle = useAnimatedStyle(() => ({
        opacity: contentOpacity.value,
        transform: [{ translateX: contentX.value }],
    }))

    const handleBack = () => {
        if (step > 1) {
            animateToStep((step - 1) as Step)
        } else {
            router.back()
        }
    }

    const meta = STEP_META[step]

    return (
        <>
            <View style={{ flex: 1, backgroundColor: 'white', paddingTop: insets.top }}>
                <StatusBar style="dark" />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'position' : undefined}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flex: 1 }}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={{ flex: 1 }}>

                            {/* ── Header ── */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 24,
                                    paddingTop: 8,
                                    paddingBottom: 16,
                                }}
                            >
                                <Pressable
                                    onPress={handleBack}
                                    style={({ pressed }) => ({
                                        opacity: pressed ? 0.7 : 1,
                                        width: 42,
                                        height: 42,
                                        borderRadius: 21,
                                        borderWidth: 1,
                                        borderColor: '#E5E7EB',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    })}
                                >
                                    <Feather name="arrow-left" size={18} color="#1E1E1E" />
                                </Pressable>

                                {/* Animated step pill indicators */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    {([1, 2, 3] as Step[]).map((s) => (
                                        <StepDot key={s} isActive={step === s} />
                                    ))}
                                </View>

                                {/* Spacer to balance the back button */}
                                <View style={{ width: 42 }} />
                            </View>

                            {/* ── Scrollable content (animated on step change) ── */}
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                                keyboardDismissMode="on-drag"
                                contentContainerStyle={{
                                    flexGrow: 1,
                                    paddingHorizontal: 30,
                                    paddingBottom: Math.max(insets.bottom, 24),
                                }}
                            >
                                <Animated.View style={contentAnimStyle}>
                                    {/* Icon badge */}
                                    <View
                                        style={{
                                            marginTop: 20,
                                            marginBottom: 22,
                                            width: 64,
                                            height: 64,
                                            backgroundColor: '#F4F4F5',
                                            borderRadius: 20,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Feather name={meta.icon} size={28} color="#1E1E1E" />
                                    </View>

                                    <Text
                                        style={{
                                            fontSize: Platform.OS === 'ios' ? 24 : 26,
                                            fontWeight: '700',
                                            color: '#1E1E1E',
                                            letterSpacing: -0.5,
                                            marginBottom: 8,
                                        }}
                                    >
                                        {meta.title}
                                    </Text>

                                    {/* Step 2 shows the email address on its own line */}
                                    {step === 2 ? (
                                        <View style={{ marginBottom: 32 }}>
                                            <Text
                                                style={{
                                                    color: '#6B7280',
                                                    fontSize: Platform.OS === 'ios' ? 15 : 16,
                                                    lineHeight: 24,
                                                }}
                                            >
                                                {meta.subtitle}
                                            </Text>
                                            <Text
                                                style={{
                                                    color: '#1E1E1E',
                                                    fontSize: Platform.OS === 'ios' ? 15 : 16,
                                                    fontWeight: '600',
                                                }}
                                            >
                                                {email || 'your email address'}
                                            </Text>
                                        </View>
                                    ) : (
                                        <Text
                                            style={{
                                                color: '#6B7280',
                                                fontSize: Platform.OS === 'ios' ? 15 : 16,
                                                lineHeight: 24,
                                                marginBottom: 32,
                                            }}
                                        >
                                            {meta.subtitle}
                                        </Text>
                                    )}

                                    {/* ── Step 1: Email ── */}
                                    {step === 1 && (
                                        <>
                                            <CustomInput
                                                label="Email address"
                                                value={email}
                                                setValue={setEmail}
                                                placeholder="you@example.com"
                                                keyboardType="email-address"
                                            />
                                            <CustomButton
                                                onPressHandler={() => animateToStep(2)}
                                                buttonText="Send reset code"
                                                classStyle="mt-2"
                                            />
                                        </>
                                    )}

                                    {/* ── Step 2: OTP ── */}
                                    {step === 2 && (
                                        <>
                                            <OtpInput
                                                numberOfDigits={6}
                                                focusColor="#2C2C2C"
                                                autoFocus={false}
                                                hideStick={true}
                                                placeholder="------"
                                                blurOnFilled={true}
                                                type="numeric"
                                                onFilled={(text) => console.log(`OTP: ${text}`)}
                                                textInputProps={{ accessibilityLabel: 'One-Time Password' }}
                                                theme={{
                                                    containerStyle: styles.otpContainer,
                                                    pinCodeContainerStyle: styles.pinCodeContainer,
                                                    pinCodeTextStyle: styles.pinCodeText,
                                                    focusedPinCodeContainerStyle: styles.activePinCode,
                                                    filledPinCodeContainerStyle: styles.filledPinCode,
                                                    placeholderTextStyle: styles.otpPlaceholder,
                                                }}
                                            />

                                            <CustomButton
                                                onPressHandler={() => animateToStep(3)}
                                                buttonText="Verify code"
                                                classStyle="mt-6"
                                            />

                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginTop: 20,
                                                }}
                                            >
                                                <Text style={{ color: '#6B7280', fontSize: 13 }}>
                                                    Didn&apos;t receive it?{' '}
                                                </Text>
                                                <Pressable
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
                                                        Resend code
                                                    </Text>
                                                </Pressable>
                                            </View>
                                        </>
                                    )}

                                    {/* ── Step 3: New password ── */}
                                    {step === 3 && (
                                        <>
                                            <CustomInput
                                                label="New password"
                                                value={password}
                                                setValue={setPassword}
                                                placeholder="Min. 8 characters"
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

                                            <CustomInput
                                                label="Confirm new password"
                                                value={confirmPassword}
                                                setValue={setConfirmPassword}
                                                placeholder="Re-enter new password"
                                                secureTextEntry={!showConfirmPassword}
                                                suffix={
                                                    <Pressable
                                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        hitSlop={8}
                                                    >
                                                        <Feather
                                                            name={showConfirmPassword ? 'eye' : 'eye-off'}
                                                            size={18}
                                                            color="#A9A9A9"
                                                        />
                                                    </Pressable>
                                                }
                                            />

                                            <CustomButton
                                                onPressHandler={() => router.replace('/(guest)/SignInScreen')}
                                                buttonText="Reset password"
                                                classStyle="mt-2"
                                            />
                                        </>
                                    )}
                                </Animated.View>
                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </View>

            <LoadingOverlay isVisible={false} />
        </>
    )
}

export default ForgotPassword

const styles = StyleSheet.create({
    otpContainer: {
        marginBottom: 4,
    },
    pinCodeContainer: {
        borderWidth: 2,
        borderColor: '#D9D9D9',
        borderRadius: 12,
        height: 52,
    },
    pinCodeText: {
        fontFamily: 'Inter_400Regular',
        fontSize: 20,
        fontWeight: '600',
    },
    activePinCode: {
        borderColor: '#2C2C2C',
    },
    filledPinCode: {
        borderColor: '#2C2C2C',
        backgroundColor: '#F5F5F5',
    },
    otpPlaceholder: {
        color: '#D9D9D9',
    },
})
