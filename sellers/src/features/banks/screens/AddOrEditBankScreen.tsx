import { View, Text, Pressable, Platform } from 'react-native'
import React, { useState } from 'react'
import SafeAreaView from '@/src/components/ui/NativeStyledSafeAreaView'
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import BottomSheetDropdown from '@/src/components/ui/BottomSheetDropdown';
import CustomInput from '@/src/components/ui/CustomInput';
import CustomButton from '@/src/components/ui/CustomButton';


const banks = [
    { label: 'Zenith Bank', id: '058' },
    { label: 'GTBank', id: '059' },
    { label: 'Access Bank', id: '060' },
    { label: 'FBN', id: '061' },
    { label: 'UBA', id: '062' },
    { label: 'WEMA', id: '063' },
    { label: 'Polaris', id: '064' },
    { label: 'STERLING', id: '065' },
];

const AddOrEditBankScreen = () => {
    const [bank, setBank] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const router = useRouter();


    const onChange = (item) => {
        if ('id' in item) setBank(item.id);
        else if ('value' in item) setBank(item.value);
    };

    const goBack = () => {
        router.back();
    }

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <View className='px-6 pb-4 pt-2.5 flex-row gap-4 items-center border-border/40 border-b-4'>
                <Pressable onPress={goBack} className='p-2 border rounded-full border-border bg-light'>
                    <Feather name="arrow-left" size={18} color="#1E1E1E" />
                </Pressable>
                <Text className={`text-primary-light ${Platform.OS === 'ios' ? 'text-2xl' : 'text-3xl'}`}>Add bank details</Text>
            </View>

            <View className='flex-1 px-6 pt-3 pb-6'>
                <View className='flex-row items-start gap-2 px-2 py-3 rounded-xl bg-light'>
                    <Feather name="info" size={14} color="#303030" />
                    <Text className={`font-normal text-secondary ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'} flex-1`}>Your account name must match either your registered business name or the name you used to verify your City Commerce account.</Text>
                </View>

                <BottomSheetDropdown
                        data={banks}
                        value={bank}
                        onChange={onChange}
                        label="Bank"
                        placeholder="Select Bank"
                        searchable={true}
                    />

                    <CustomInput
                        label="Account number"
                        placeholder="Enter account number"
                        value={accountNumber}
                        setValue={setAccountNumber}
                        keyboardType='numeric'
                    />

                    <CustomButton
                        classStyle='!mt-auto'
                        buttonText="Save bank details"
                        onPressHandler={() => { }}
                    />
            </View>

        </SafeAreaView>
    )
}

export default AddOrEditBankScreen
