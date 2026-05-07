import { View, Text, Image, Platform } from 'react-native'
import React from 'react'
import SafeAreaView from '@/src/components/ui/NativeStyledSafeAreaView'
import CustomButton from '@/src/components/ui/CustomButton'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const IdentityVerificationSuccess = () => {
    const router = useRouter()

    return (
        <>
            <StatusBar style='dark' />
            <SafeAreaView className='flex-1 bg-white px-10'>
                <View className='flex-1  items-center pt-32'>
                    <View className='w-40 h-40 items-center justify-center'>
                        <Image
                            source={require('@/assets/images/success-identity-verification-icon.jpg')}
                            style={{ width: 140, height: 140 }}
                            resizeMode='contain'
                        />
                    </View>

                    <View className='items-center mt-5 px-6'>
                        <Text className={`font-inter-semibold font-semibold text-body mb-4 tracking-tight ${Platform.OS === 'ios' ? 'text-2xl' : 'text-3xl'}`}>
                            Identity Verified
                        </Text>
                        <Text className={`text-body font-normal font-inter mb-10 leading-6 text-center ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>
                            Your identity verification is complete. Now you can set up your store and start selling.
                        </Text>
                    </View>
                </View>

                <View className=''>
                    <CustomButton
                        buttonText='Continue'
                        onPressHandler={() => router.replace('/(auth)/Shops/StoreSetupScreen')}
                        classStyle={`w-full py-5 ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}
                    />
                </View>
            </SafeAreaView>
        </>
    )
}

export default IdentityVerificationSuccess;
