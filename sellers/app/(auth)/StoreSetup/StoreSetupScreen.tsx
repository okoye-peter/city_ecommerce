import { View, Text, Pressable, Platform, ScrollView } from 'react-native'
import React, { useState } from 'react'
import SafeAreaView from '@/components/ui/common/NativeStyledSafeAreaView'
import Feather from '@expo/vector-icons/Feather';
import Shop from '@/components/storeSetup/Shop';
import Bank from '@/components/storeSetup/Bank';
import Product from '@/components/storeSetup/Product';
import CustomButton from '@/components/ui/common/CustomButton';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const ProfileCreationScreen = () => {
    const router = useRouter()

    const [step, setStep] = useState(1)
    const pressHandler = () => {
        if (step < 3) {
            setStep((prev) => prev + 1)
        } else {
            router.replace('/(auth)/StoreSetup/StoreSetupSuccessScreen')
        }
    }

    return (
        <>
            <StatusBar style='dark' />
            <SafeAreaView className='flex-1 bg-white pt-4'>
                <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>

                    <View className='flex-row w-full justify-start mb-3 px-8'>
                        <Pressable
                            className={`w-10 h-10 rounded-full bg-light border border-border items-center justify-center ${step < 2 ? 'opacity-30' : 'opacity-100'}`}
                            disabled={step < 2}
                            onPress={() => setStep((prev) => prev > 1 ? prev - 1 : prev)}
                        >
                            <Feather name="arrow-left" size={20} color="#1E1E1E" />
                        </Pressable>
                    </View>

                    {/* indicators */}
                    <View className='flex-row gap-3 px-8 mt-3'>
                        <View className={`flex-1 p-1 rounded-lg bg-primary`}></View>
                        <View className={`flex-1 p-1 rounded-lg ${step >= 2 ? 'bg-primary' : 'bg-light'}`}></View>
                        <View className={`flex-1 p-1 rounded-lg ${step === 3 ? 'bg-primary' : 'bg-light'}`}></View>
                    </View>

                    {/* content */}
                    <View className='flex-1'>
                        {step === 1 && <Shop />}
                        {step === 2 && <Product />}
                        {step === 3 && <Bank />}
                    </View>
                </ScrollView>

                <View className='px-10 py-4 bg-white'>
                    <CustomButton buttonText={step === 3 ? 'Submit' : 'Continue'} onPressHandler={pressHandler} />
                    <Text className={`text-secondary mt-2 text-center ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>Step {step} of 3 • You can always edit these later</Text>
                </View>
            </SafeAreaView>
        </>
    )
}

export default ProfileCreationScreen