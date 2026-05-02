import { View, Text, StyleSheet, Platform } from 'react-native'
import React from 'react'
import { OtpInput } from "react-native-otp-entry";
import CustomButton from '@/src/components/ui/CustomButton';
import AppModal from '@/src/components/ui/AppModal';

const PhoneVerificationModal = ({ isVisible, onClose, verifyPhoneNumber }: { isVisible: boolean, onClose: () => void, verifyPhoneNumber: () => void }) => {
    return (
        <AppModal
            isVisible={isVisible}
            onClose={onClose}
            title="Confirm it's really you"
        >
            <View>
                <Text className={`text-body text-base font-normal ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>
                    We've sent a One‑Time Password (OTP) to your registered mobile number. Type it below to secure your account and continue managing your store.
                </Text>

                <OtpInput
                    numberOfDigits={6}
                    focusColor="green"
                    autoFocus={false}
                    hideStick={true}
                    placeholder="******"
                    blurOnFilled={true}
                    disabled={false}
                    type="numeric"
                    secureTextEntry={false}
                    focusStickBlinkingDuration={500}
                    onFocus={() => console.log("Focused")}
                    onBlur={() => console.log("Blurred")}
                    onTextChange={(text) => console.log(text)}
                    onFilled={(text) => console.log(`OTP is ${text}`)}
                    textInputProps={{
                        accessibilityLabel: "One-Time Password",
                    }}
                    textProps={{
                        accessibilityRole: "text",
                        accessibilityLabel: "OTP digit",
                        allowFontScaling: false,
                    }}
                    theme={{
                        containerStyle: styles.container,
                        pinCodeContainerStyle: styles.pinCodeContainer,
                        pinCodeTextStyle: styles.pinCodeText,
                        focusStickStyle: styles.focusStick,
                        focusedPinCodeContainerStyle: styles.activePinCodeContainer,
                        placeholderTextStyle: styles.placeholderText,
                        filledPinCodeContainerStyle: styles.filledPinCodeContainer,
                        disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
                    }}
                />

                <CustomButton
                    buttonText="Verify"
                    onPressHandler={verifyPhoneNumber}
                    classStyle='mt-6'
                />
            </View>
        </AppModal>
    )
}

export default PhoneVerificationModal

const styles = StyleSheet.create({
    container: {
        marginTop: 25,
    },
    pinCodeContainer: {
        borderWidth: 2,
        height: 50,
    },
    pinCodeText: {
        fontSize: 16,
        fontWeight: 500,
    },
    focusStick: {},
    activePinCodeContainer: {
        borderColor: 'var(--color-body)'
    },
    placeholderText: {},
    filledPinCodeContainer: {},
    disabledPinCodeContainer: {}
})
