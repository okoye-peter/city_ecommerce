import { View, Text, Platform } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import CustomButton from '@/components/ui/common/CustomButton'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const StoreSetupSuccessScreen = () => {
    const router = useRouter();

    return (
        <>
            <StatusBar style='dark' />
            <View className='flex-1 bg-white items-center pt-44 px-8 pb-10'>
                <View className='h-[230px] w-[230px]'>
                    <Image
                        source={require('@/assets/images/shop_setup/styled-shop.jpg')}
                        style={{ width: '100%', height: '100%' }}
                        contentFit='contain'
                    />
                </View>

                <Text className='font-inter-semibold font-semibold text-body mb-2 tracking-tight text-2xl'>You’re all set!</Text>
                <Text className={`text-body font-normal font-inter mb-10 leading-6 text-center ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>
                    Your shop is live. Start accepting orders and watch your business grow.
                </Text>

                <CustomButton
                    buttonText='Continue'
                    onPressHandler={() => { router.replace('/(auth)/(tabs)/HomeScreen') }}
                    classStyle={`mt-auto w-full`}
                />
            </View>
        </>

    )
}

export default StoreSetupSuccessScreen