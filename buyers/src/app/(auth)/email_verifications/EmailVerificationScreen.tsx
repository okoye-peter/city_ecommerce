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
import React, { useState, useEffect, useRef } from 'react'
import { StatusBar } from 'expo-status-bar'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'


import { Feather } from '@expo/vector-icons'
import { OtpInput, OtpInputRef } from 'react-native-otp-entry'
import Toast from 'react-native-toast-message'
import { isAxiosError } from 'axios';
import { useSendEmailVerification, useVerifyEmail } from '@/features/auth/queries';
import LoadingModal from '@/components/ui/LoadingModal';
import CustomButton from '@/components/ui/CustomButton';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const RESEND_COOLDOWN = 60

const EmailVerification = () => {
    const router = useRouter()
    const insets = useSafeAreaInsets()
    const user = useSelector((state: RootState) => state.auth.user);
    const email = user?.email

    console.log('EmailVerification', {
        email,
        user
    })

    const [otp, setOtp] = useState('')
    const [countdown, setCountdown] = useState(RESEND_COOLDOWN)
    const otpRef = useRef<OtpInputRef>(null)

    const { mutateAsync: sendCode, isPending: isSending } = useSendEmailVerification()
    const { mutateAsync: verifyEmail, isPending: isVerifying } = useVerifyEmail()

    useEffect(() => {
        if (countdown <= 0) return
        const timer = setInterval(() => setCountdown(c => c - 1), 1000)
        return () => clearInterval(timer)
    }, [countdown])

    const handleResend = async () => {
        if (countdown > 0 || !email) return
        try {
            const res = await sendCode(email)
            console.log('Resend response:', res)
            Toast.show({ 
                type: 'success', 
                text1: 'Verification code resent', 
                text2: res.message,
                swipeable: true
            })
            setCountdown(RESEND_COOLDOWN)
            otpRef.current?.clear()
            setOtp('')
        } catch (error: unknown) {
            const axiosError = isAxiosError(error) ? error : null
            console.log('Resend response:', axiosError?.response ?? error)
            Toast.show({ 
                type: 'error', 
                text1: 'Failed to resend', 
                text2: axiosError?.response?.data?.message ?? 'An error occurred. Please try again.',
                swipeable: true
            })
        }
    }

    const handleVerify = async () => {
        if (otp.length < 6 || !email) return
        try {
            const res = await verifyEmail({ email, otp })
            Toast.show({ type: 'success', text1: 'Email verified', text2: res.message })
            router.replace('/(auth)/(tabs)/ExploreScreen')
        } catch (error: any) {
            const message = error?.response?.data?.message ?? 'Invalid or expired code. Please try again.'
            Toast.show({ 
                type: 'error', 
                text1: 'Verification Failed', 
                text2: message,
                swipeable: true
            })
            otpRef.current?.clear()
            setOtp('')
        }
    }

    return (
        <>
            <LoadingModal visible={isSending || isVerifying} text={isSending ? 'resending OTP' : 'verifying email'} />

            <View style={{ flex: 1, backgroundColor: 'white', paddingTop: insets.top }}>
                <StatusBar style="dark" />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'position' : undefined}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flex: 1 }}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={{ flex: 1 }}>

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
                                    <Feather name="mail" size={28} color="#1E1E1E" />
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
                                    Verify your email
                                </Text>

                                <View style={{ marginBottom: 32 }}>
                                    <Text
                                        style={{
                                            color: '#6B7280',
                                            fontSize: Platform.OS === 'ios' ? 15 : 16,
                                            lineHeight: 24,
                                        }}
                                    >
                                        We&apos;ve sent a 6-digit code to
                                    </Text>
                                    <Text
                                        style={{
                                            color: '#1E1E1E',
                                            fontSize: Platform.OS === 'ios' ? 15 : 16,
                                            fontWeight: '600',
                                        }}
                                    >
                                        {email ?? 'your email address'}
                                    </Text>
                                </View>

                                <OtpInput
                                    ref={otpRef}
                                    numberOfDigits={6}
                                    focusColor="#2C2C2C"
                                    autoFocus={false}
                                    hideStick={true}
                                    placeholder="------"
                                    blurOnFilled={true}
                                    type="numeric"
                                    onTextChange={setOtp}
                                    onFilled={setOtp}
                                    textInputProps={{ accessibilityLabel: 'Email verification code' }}
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
                                    onPressHandler={handleVerify}
                                    buttonText="Verify email"
                                    classStyle="mt-6"
                                    isLoading={isVerifying}
                                    disabled={otp.length < 6 || isSending || isVerifying}
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
                                        onPress={handleResend}
                                        disabled={countdown > 0}
                                        style={({ pressed }) => ({
                                            opacity: pressed && countdown === 0 ? 0.7 : 1,
                                        })}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                fontWeight: '600',
                                                color: countdown > 0 ? '#9CA3AF' : '#1E1E1E',
                                                textDecorationLine: countdown > 0 ? 'none' : 'underline',
                                            }}
                                        >
                                            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
                                        </Text>
                                    </Pressable>
                                </View>
                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </View>
        </>
    )
}

export default EmailVerification

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
