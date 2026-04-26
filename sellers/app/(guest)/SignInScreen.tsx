import { View, Text, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native'
import React, { useState, useRef } from 'react'
import { Image } from 'expo-image'
import PhoneInput from "react-native-phone-number-input";
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PhoneVerificationModal from '@/components/ui/SignIn/PhoneVerificationModal';
import { useRouter } from 'expo-router';
import LoadingOverlay from '@/components/ui/common/LoadingOverlay';
import CustomButton from '@/components/ui/common/CustomButton';


const SignIn = () => {
    const router = useRouter();
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [formattedValue, setFormattedValue] = useState("");
    const phoneInput = useRef<PhoneInput>(null);
    const insets = useSafeAreaInsets();
    const [isPhoneNumberVerificationModalVisible, setIsPhoneNumberVerificationModalVisible] = useState(false);


    const openPhoneNumberVerificationModal = () => {
        setIsPhoneNumberVerificationModalVisible(true);
    }

    const handleVerifyPhoneNumber = () => {
        setIsPhoneNumberVerificationModalVisible(false)
        router.push('/(auth)/IdentityVerification/VerifyIdentityScreen')
    }

    // You can adjust these values to control the padding when the keyboard is active/inactive
    const inactivePadding = Math.max(insets.bottom, 24);


    return (
        <>
            <KeyboardAvoidingView
                behavior="position"
                // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                contentContainerStyle={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? -30 : -40}
                className='flex-1'
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className='flex-1 bg-white'>
                        <StatusBar style="light" />

                        <View style={{ height: '52%' }} className='w-full'>
                            <Image
                                source={require("@/assets/images/signin/home_screen.jpg")}
                                style={{ width: '100%', height: '100%' }}
                                contentFit="cover"
                                transition={500}
                            />
                        </View>

                        <View
                            style={{
                                paddingBottom: inactivePadding,
                                flex: 1,
                                backgroundColor: 'white',
                                marginTop: -40,
                                borderTopLeftRadius: 40,
                                borderTopRightRadius: 40
                            }}
                            className='px-8 pt-10 shadow-2xl elevation-2xl'
                        >
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                                keyboardDismissMode="on-drag"
                                contentContainerStyle={{ flexGrow: 1 }}
                            >
                                <Text className={`font-bold text-body mb-4 tracking-tight ${Platform.OS === 'ios' ? 'text-2xl' : 'text-3xl'}`}>
                                    Create an account or log in to unlock the full marketplace experience.
                                </Text>
                                <Text className={`text-secondary text-base mb-6 leading-6 ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>
                                    Register quickly to set up your store, manage products, and start reaching customers.
                                </Text>

                                <PhoneInput
                                    ref={phoneInput}
                                    defaultValue={value}
                                    defaultCode="NG"
                                    layout="first"
                                    onChangeText={(text) => setValue(text)}
                                    onChangeFormattedText={(text) => setFormattedValue(text)}
                                    containerStyle={{
                                        width: '100%',
                                        height: 56,
                                        borderRadius: 16,
                                        borderWidth: 1,
                                        borderColor: '#F1F5F9',
                                        backgroundColor: '#FFFFFF',
                                    }}
                                    flagButtonStyle={{
                                        width: 60,
                                        backgroundColor: 'transparent',
                                        borderRightWidth: 0,
                                    }}
                                    countryPickerButtonStyle={{
                                        backgroundColor: '#F8FAFC',
                                        borderRadius: 12,
                                        width: 50,
                                        height: 40,
                                        marginLeft: 10,
                                        marginTop: 8,
                                    }}
                                    textContainerStyle={{
                                        backgroundColor: 'transparent',
                                        paddingVertical: 0,
                                    }}
                                    textInputStyle={{
                                        fontFamily: 'Inter_400Regular',
                                        fontSize: 16,
                                        color: '#1E1E1E',
                                    }}
                                    codeTextStyle={{
                                        fontFamily: 'Inter_400Regular',
                                        fontSize: 16,
                                        color: '#1E1E1E',
                                    }}
                                    placeholder="Phone number"
                                />

                                <CustomButton
                                    classStyle='mt-6'
                                    onPressHandler={openPhoneNumberVerificationModal}
                                    buttonText="Sign in"
                                />

                                <View className='mt-6 items-center'>
                                    <Text className='text-secondary text-[13px] font-normal text-center leading-5'>
                                        If you are creating a new account. <Text className='underline'>Terms & Conditions</Text> and <Text className='underline'>Privacy Policy</Text> will apply.
                                    </Text>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

            {/* phone number verification */}
            <PhoneVerificationModal isVisible={isPhoneNumberVerificationModalVisible} onClose={() => setIsPhoneNumberVerificationModalVisible(false)} verifyPhoneNumber={handleVerifyPhoneNumber} />

            {/* loading */}
            <LoadingOverlay isVisible={loading} />
        </>
    )
}

export default SignIn