import { View, Text, Pressable, Platform, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import SafeAreaView from '@/src/components/ui/NativeStyledSafeAreaView'
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import BottomSheetDropdown from '@/src/components/ui/BottomSheetDropdown';
import CustomInput from '@/src/components/ui/CustomInput';
import CustomButton from '@/src/components/ui/CustomButton';
import { BankAccount } from '@/src/types';
import { useGetBanks } from '@/src/hooks/useBank';
import { useCreateBankAccounts, useUpdateBankAccounts } from '../queries';
import { bankSchema } from '../bankSchema';
import Toast from 'react-native-toast-message';
import { isAxiosError } from 'axios';
import LoadingOverlay from '@/src/components/ui/LoadingOverlay';


const AddOrEditBankScreen = () => {
    const params = useLocalSearchParams();
    const bankAccount = params.bankAccount 
        ? JSON.parse(params.bankAccount as string) as BankAccount 
        : undefined;
    const [bank, setBank] = useState(bankAccount?.bankId?.toString() ?? '');
    const [accountNumber, setAccountNumber] = useState(bankAccount?.accountNumber ?? '');
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { banks: bankList } = useGetBanks()
    const router = useRouter();

    const banks = useMemo(() => 
        (bankList ?? []).map((bank) => ({ label: bank.name, value: bank.id.toString() })),
        [bankList]
    );

    const { mutateAsync: createBankAccount } = useCreateBankAccounts();
    const { mutateAsync: updateBankAccount } = useUpdateBankAccounts();

    const onChange = useCallback((item: any) => {
        if ('id' in item) setBank(item.id?.toString());
        else if ('value' in item) setBank(item.value?.toString());
    }, []);

    const handleSubmit = useCallback(async () => {
        const result = bankSchema.safeParse({
            bankId: bank,
            accountNumber
        })

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
        setIsSubmitting(true)

        try {
            if (bankAccount?.id) {
                await updateBankAccount({
                    bankAccountId: bankAccount.id,
                    bankAccountData: result.data
                })
            } else {
                await createBankAccount(result.data)
            }
           
            Toast.show({
                type: 'success',
                text1: `Success`,
                text2: `Bank ${bankAccount?.id ? 'Updated' : 'Created'} successfully`,
                swipeable: true,
            })
            
            router.back();
        } catch (error) {
            console.log('error', error)
            const message = isAxiosError(error) ? error?.response?.data?.message : 'Operation failed. Please try again.'
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: message,
                swipeable: true,
            })
        } finally {
            setIsSubmitting(false)
        }
    }, [bank, accountNumber, bankAccount, createBankAccount, updateBankAccount, router])

    const goBack = useCallback(() => {
        router.back();
    }, [router])

    const isEdit = !!bankAccount?.id;

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <LoadingOverlay isVisible={isSubmitting} />
            <View className='px-6 pb-4 pt-2.5 flex-row gap-4 items-center border-border/40 border-b-4'>
                <Pressable onPress={goBack} className='p-2 border rounded-full border-border bg-light'>
                    <Feather name="arrow-left" size={18} color="#1E1E1E" />
                </Pressable>
                <Text className={`text-primary-light ${Platform.OS === 'ios' ? 'text-2xl' : 'text-3xl'}`}>
                    {isEdit ? 'Edit bank details' : 'Add bank details'}
                </Text>
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className='flex-1'
            >
                <ScrollView 
                    contentContainerStyle={{ flexGrow: 1 }}
                    className='px-6 pt-3 pb-6'
                    keyboardShouldPersistTaps="handled"
                >
                    <View className='flex-row items-start gap-2 px-2 py-3 mb-4 rounded-xl bg-light'>
                        <Feather name="info" size={14} color="#303030" />
                        <Text className={`font-normal text-secondary ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'} flex-1`}>
                            Your account name must match either your registered business name or the name you used to verify your City Commerce account.
                        </Text>
                    </View>

                    <BottomSheetDropdown
                        data={banks}
                        value={bank}
                        onChange={onChange}
                        label="Bank"
                        placeholder="Select Bank"
                        searchable={true}
                        keyField="value"
                    />
                    
                    {errors.bankId && (
                        <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.bankId}</Text>
                    )}

                    <CustomInput
                        label="Account number"
                        placeholder="Enter account number"
                        value={accountNumber}
                        setValue={setAccountNumber}
                        keyboardType='numeric'
                        error={errors.accountNumber}
                    />

                    <View className='pt-6 mt-auto'>
                        <CustomButton
                            buttonText={isEdit ? 'Update Bank Account' : 'Create Bank Account'}
                            onPressHandler={handleSubmit}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}

export default AddOrEditBankScreen
