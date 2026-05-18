import {
    View, Text, Platform, TextInput, TouchableOpacity,
    KeyboardAvoidingView, ScrollView, Dimensions,
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { clsx } from 'clsx'
import CustomButton from '@/components/ui/CustomButton'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const OTP_LENGTH = 6
const OTP_BOX_WIDTH = Math.floor((SCREEN_WIDTH - 48 - (OTP_LENGTH - 1) * 10) / OTP_LENGTH)

type Step = 1 | 2 | 3

const stepMeta: Record<Step, { icon: React.ComponentProps<typeof Ionicons>['name']; title: string; sub: string }> = {
    1: {
        icon: 'mail-outline',
        title: 'Forgot Password?',
        sub: "Enter your email address and we'll send you a verification code.",
    },
    2: {
        icon: 'keypad-outline',
        title: 'Enter OTP',
        sub: '',
    },
    3: {
        icon: 'shield-checkmark-outline',
        title: 'New Password',
        sub: 'Create a strong new password for your account.',
    },
}

const ForgotPasswordScreen = () => {
    const insets = useSafeAreaInsets()
    const router = useRouter()

    const [step, setStep] = useState<Step>(1)
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [resendTimer, setResendTimer] = useState(0)

    const otpRefs = useRef<Array<TextInput | null>>(Array(OTP_LENGTH).fill(null))
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        return () => { if (countdownRef.current) clearInterval(countdownRef.current) }
    }, [])

    const startResendTimer = () => {
        setResendTimer(60)
        if (countdownRef.current) clearInterval(countdownRef.current)
        countdownRef.current = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) { clearInterval(countdownRef.current!); return 0 }
                return prev - 1
            })
        }, 1000)
    }

    const handleSendOtp = () => {
        if (!email.trim()) return
        startResendTimer()
        setStep(2)
    }

    const handleOtpChange = (val: string, index: number) => {
        const next = [...otp]
        next[index] = val.replace(/[^0-9]/g, '').slice(-1)
        setOtp(next)
        if (val && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus()
    }

    const handleOtpKeyPress = (key: string, index: number) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            const next = [...otp]
            next[index - 1] = ''
            setOtp(next)
            otpRefs.current[index - 1]?.focus()
        }
    }

    const handleResend = () => {
        setOtp(Array(OTP_LENGTH).fill(''))
        otpRefs.current[0]?.focus()
        startResendTimer()
    }

    const handleBack = () => {
        if (step === 1) router.back()
        else setStep((s) => (s - 1) as Step)
    }

    const otpFilled = otp.join('').length === OTP_LENGTH
    const canReset = newPassword.length >= 6 && newPassword === confirmPassword
    const meta = stepMeta[step]

    return (
        <KeyboardAvoidingView className="flex-1" behavior="padding">
            <StatusBar style="dark" animated />
            <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>

                {/* Header */}
                <View className="flex-row items-center justify-between px-5 py-3">
                    <TouchableOpacity
                        onPress={handleBack}
                        className="w-[38px] h-[38px] rounded-full bg-light items-center justify-center"
                    >
                        <Ionicons name="arrow-back" size={22} color="#1E1E1E" />
                    </TouchableOpacity>

                    <View className="flex-row items-center gap-2">
                        {([1, 2, 3] as Step[]).map(s => (
                            <View
                                key={s}
                                className={clsx(
                                    'h-1.5 rounded-full',
                                    s <= step ? 'w-7 bg-primary' : 'w-2.5 bg-gray-200'
                                )}
                            />
                        ))}
                    </View>

                    <View className="w-[38px]" />
                </View>

                <ScrollView
                    contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: insets.bottom + 32 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Icon */}
                    <View className="w-[72px] h-[72px] rounded-full bg-light items-center justify-center mb-6">
                        <Ionicons name={meta.icon} size={32} color="#1E1E1E" />
                    </View>

                    <Text className={clsx('font-Inter-Bold text-primary mb-2', Platform.OS === 'ios' ? 'text-[26px]' : 'text-[28px]')}>
                        {meta.title}
                    </Text>
                    <Text className="font-Inter text-sm text-gray-500 mb-8 leading-[22px]">
                        {step === 2 ? `We sent a 6-digit code to\n${email}` : meta.sub}
                    </Text>

                    {/* Step 1: Email */}
                    {step === 1 && (
                        <>
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
                            <CustomButton buttonText="Send OTP" onPressHandler={handleSendOtp} disabled={!email.trim()} />
                        </>
                    )}

                    {/* Step 2: OTP */}
                    {step === 2 && (
                        <>
                            <View className="flex-row gap-2.5 mb-7">
                                {otp.map((digit, i) => (
                                    <TextInput
                                        key={i}
                                        ref={ref => { otpRefs.current[i] = ref }}
                                        style={{
                                            width: OTP_BOX_WIDTH,
                                            height: 60,
                                            borderRadius: 12,
                                            borderWidth: 1.5,
                                            borderColor: digit ? '#1E1E1E' : 'transparent',
                                            backgroundColor: '#F5F5F5',
                                            fontFamily: 'Inter_700Bold',
                                            fontSize: 22,
                                            color: '#1E1E1E',
                                            textAlign: 'center',
                                        }}
                                        value={digit}
                                        onChangeText={val => handleOtpChange(val, i)}
                                        onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, i)}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        selectTextOnFocus
                                    />
                                ))}
                            </View>

                            <CustomButton buttonText="Verify OTP" onPressHandler={() => setStep(3)} disabled={!otpFilled} />

                            <View className="items-center mt-5">
                                {resendTimer > 0 ? (
                                    <Text className="text-sm text-gray-400 font-Inter">
                                        Resend code in{' '}
                                        <Text className="font-Inter-SemiBold text-primary">{resendTimer}s</Text>
                                    </Text>
                                ) : (
                                    <TouchableOpacity onPress={handleResend}>
                                        <Text className="text-sm font-Inter-SemiBold text-primary">Resend OTP</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </>
                    )}

                    {/* Step 3: New Password */}
                    {step === 3 && (
                        <>
                            <View className="flex-row items-center bg-light rounded-[14px] px-4 h-14 mb-3.5">
                                <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
                                <TextInput
                                    className="flex-1 font-Inter text-[15px] text-primary"
                                    placeholder="New password"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry={!showNew}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                />
                                <TouchableOpacity onPress={() => setShowNew(v => !v)} hitSlop={8}>
                                    <Ionicons name={showNew ? 'eye-outline' : 'eye-off-outline'} size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row items-center bg-light rounded-[14px] px-4 h-14 mb-7">
                                <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
                                <TextInput
                                    className="flex-1 font-Inter text-[15px] text-primary"
                                    placeholder="Confirm new password"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry={!showConfirm}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                                <TouchableOpacity onPress={() => setShowConfirm(v => !v)} hitSlop={8}>
                                    <Ionicons name={showConfirm ? 'eye-outline' : 'eye-off-outline'} size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                            </View>

                            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                                <Text className="font-Inter text-[13px] text-red-500 -mt-5 mb-3">
                                    Passwords do not match
                                </Text>
                            )}

                            <CustomButton buttonText="Reset Password" onPressHandler={() => router.back()} disabled={!canReset} />
                        </>
                    )}
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    )
}

export default ForgotPasswordScreen
