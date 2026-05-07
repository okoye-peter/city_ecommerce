import { View, Text, Platform, ScrollView } from 'react-native'
import React, { useState } from 'react'
import SafeAreaView from '@/src/components/ui/NativeStyledSafeAreaView'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import BottomSheetDropdown from '@/src/components/ui/BottomSheetDropdown'
import CustomInput from '@/src/components/ui/CustomInput'
import Feather from '@expo/vector-icons/Feather';
import CustomButton from '@/src/components/ui/CustomButton'
import { StatusBar } from 'expo-status-bar'
import { useVerifyIdentity } from '../queries';
import { verifyIdentitySchema } from '../verifyIdentitySchema';
import Toast from 'react-native-toast-message';
import LoadingOverlay from '@/src/components/ui/LoadingOverlay';

const idTypes = [
    { id: 'NATIONAL_ID', label: 'National ID Card' },
    { id: 'INTERNATIONAL_PASSPORT', label: 'International Passport' },
    { id: 'DRIVERS_LICENSE', label: "Driver's License" },
]

const VerifyIdentityScreen = () => {
    const router = useRouter()
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [idNumber, setIdNumber] = useState<string>('')
    const [errors, setErrors] = useState<Record<string, string>>({})
    const { mutateAsync: verifyIdentity, isPending } = useVerifyIdentity()

    const handleSubmitIdentity = async () => {
        const result = verifyIdentitySchema.safeParse({ verificationType: selectedId!, verificationId: idNumber })
        if (!result.success) {
            const fieldErrors: Record<string, string> = {}
            for (const issue of result.error.issues) {
                const key = issue.path[0] as string
                if (!fieldErrors[key]) fieldErrors[key] = issue.message
            }
            setErrors(fieldErrors)
            return
        }
        setErrors({})

        try {
            await verifyIdentity({ verificationType: selectedId!, verificationId: idNumber })
            router.replace('/(auth)/IdentityVerification/IdentityVerificationSuccessScreen');
        } catch (error: any) {
            
            const message = error?.response?.data?.message ?? 'Registration failed. Please try again.'
            
            Toast.show({
                type: 'error',
                text1: 'Registration Error',
                text2: message,
                swipeable: true,
            })
            setErrors({ general: message })
        }
    }

    return (
        <>
            <LoadingOverlay isVisible={isPending} />
            <StatusBar style='dark' />
            <SafeAreaView className='flex-1 bg-white'>
                <ScrollView
                    className='flex-1'
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 32, paddingTop: 40, paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className='w-12 h-12 mb-6'>
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
                            error={errors?.verificationId}
                            placeholder='Enter ID Number'
                            keyboardType='numeric'
                            />
                    </View>

                    <View className='flex-row items-start w-full p-3 rounded-lg bg-light gap-x-3'>
                        <Feather name="info" size={16} />

                        <Text className={`flex-1 text-secondary font-normal font-inter leading-relaxed ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>
                            Dial <Text className='font-semibold text-body'>*346#</Text> on your registered number and follow the steps on your screen to get your NIN.
                        </Text>
                    </View>

                    <CustomButton
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

export default VerifyIdentityScreen
