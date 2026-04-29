import { View, Text, Platform, ScrollView } from 'react-native'
import React, { useState } from 'react'
import SafeAreaView from '@/components/ui/common/NativeStyledSafeAreaView'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import BottomSheetDropdown from '@/components/ui/common/BottomSheetDropdown'
import CustomInput from '@/components/ui/common/CustomInput'
import Feather from '@expo/vector-icons/Feather';
import CustomButtom from '@/components/ui/common/CustomButton'
import { StatusBar } from 'expo-status-bar'

const idTypes = [
    { id: 'national_id', label: 'National ID Card' },
    { id: 'passport', label: 'International Passport' },
    { id: 'drivers_license', label: "Driver's License" },
]

const VerifyIdentity = () => {
    const router = useRouter()
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [idNumber, setIdNumber] = useState<string>('')

    const handleSubmitIdentity = () => {
        router.replace('/(auth)/IdentityVerification/IdentityVerificationSuccessScreen');
    }

    return (
        <>
            <StatusBar style='dark' />
            <SafeAreaView className='flex-1 bg-white'>
                <ScrollView
                    className='flex-1'
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 32, paddingTop: 40, paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className='h-12 w-12 mb-6'>
                        <Image
                            source={require('@/assets/images/vector_shield.jpg')}
                            style={{ width: '100%', height: '100%' }}
                            contentFit='contain'
                            transition={500}
                        />
                    </View>

                    <Text className={`font-inter-semibold font-semibold text-body mb-4 tracking-tight ${Platform.OS === 'ios' ? 'text-2xl' : 'text-3xl'}`}>
                        Verify your identity
                    </Text>

                    <Text className={`text-body font-normal font-inter mb-10 leading-6 ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>
                        Quick verification to keep the marketplace safe for everyone.
                    </Text>

                    <View className=''>
                        <BottomSheetDropdown
                            label="What ID do you have?"
                            data={idTypes}
                            value={selectedId}
                            onChange={(item) => {
                                if ('id' in item) setSelectedId(String(item.id));
                                else if ('value' in item) setSelectedId(String(item.value));
                            }}
                            placeholder="Select an ID type"
                            searchable={true}
                        />
                    </View>

                    <View className=''>
                        <CustomInput 
                            label="ID Number" 
                            value={idNumber} 
                            setValue={setIdNumber} 
                            placeholder='Enter ID Number' 
                            keyboardType='numeric' 
                            />
                    </View>

                    <View className='flex-row items-start w-full p-3 bg-light rounded-lg gap-x-3'>
                        <Feather name="info" size={16} />

                        <Text className={`flex-1 text-secondary font-normal font-inter leading-relaxed ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>
                            Dial <Text className='font-semibold text-body'>*346#</Text> on your registered number and follow the steps on your screen to get your NIN.
                        </Text>
                    </View>

                    <CustomButtom 
                        buttonText='Continue' 
                        onPressHandler={handleSubmitIdentity} 
                        classStyle='mt-auto' 
                        disabled={!selectedId || !idNumber}
                    />
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

export default VerifyIdentity