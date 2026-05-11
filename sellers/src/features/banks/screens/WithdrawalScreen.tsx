import { View, Text, Pressable, Platform, KeyboardAvoidingView, ScrollView } from 'react-native'
import { useCallback, useEffect, useState } from 'react'
import SafeAreaView from '@/src/components/ui/NativeStyledSafeAreaView'
import { Link, useRouter } from 'expo-router';
import CustomInput from '@/src/components/ui/CustomInput';
import Feather from '@expo/vector-icons/Feather';
import { formatPrice } from '@/src/utils/priceFormatter';
import AntDesign from '@expo/vector-icons/AntDesign';
import BankCard from '@/src/features/banks/components/BankCard';
import { useGetWallet, useInitiateWithdrawal } from '../../earnings/queries';
import { useGetUserBankAccounts } from '../queries';
import LoadingOverlay from '@/src/components/ui/LoadingOverlay';
import CustomButton from '@/src/components/ui/CustomButton';
import { initiateWithdrawalSchema } from '../../earnings/earningSchema';
import Toast from 'react-native-toast-message';
import { isAxiosError } from 'axios';

const WithdrawalScreen = () => {
    const router = useRouter();
    const { data: wallet } = useGetWallet();
    const {data: bankAccounts, isLoading} = useGetUserBankAccounts();
    const [selectedBankAccountId, setSelectedBankAccountId] = useState<string | null>(null);
    const [errors, setErrors] = useState<{amount?: string, bankAccountId?: string} | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const [amount, setAmount] = useState('');

    const goBack = useCallback(() => {
        router.back();
    }, [router]);

    const {mutateAsync: initiateWithdrawal} = useInitiateWithdrawal();

    useEffect(() => {
        if(bankAccounts?.data?.find((bankAccount) => bankAccount.isSelected === true)) {
            setSelectedBankAccountId(bankAccounts?.data?.find((bankAccount) => bankAccount.isSelected === true)?.id || null)
        }
    }, [bankAccounts])

    const handleWithdraw = useCallback(async () => {
        const result = initiateWithdrawalSchema.safeParse({
            amount: parseFloat(amount),
            bankAccountId: selectedBankAccountId,
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

        try {
            setIsProcessing(true);
            await initiateWithdrawal(result.data)

            Toast.show({
                type: 'success',
                text1: 'Withdrawal Request',
                text2: 'Withdrawal request has been initiated successfully',
                swipeable: true,
            })
            router.back();
        } catch (error) {
            const message = isAxiosError(error) ? error?.response?.data?.message : 'Withdrawal failed. Please try again.'
            Toast.show({
                type: 'error',
                text1: 'Withdrawal Error',
                text2: message,
                swipeable: true,
            })
        } finally {
            setIsProcessing(false);
        }

    }, [amount, selectedBankAccountId, initiateWithdrawal, router])

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <LoadingOverlay isVisible={isProcessing} />
            <LoadingOverlay isVisible={isLoading} />
            <View className='px-6 pb-4 pt-2.5 flex-row gap-4 items-center border-border/40 border-b-4'>
                <Pressable onPress={goBack} className='p-2 border rounded-full border-border bg-light'>
                    <Feather name="arrow-left" size={18} color="#1E1E1E" />
                </Pressable>
                <Text className={`text-primary-light ${Platform.OS === 'ios' ? 'text-2xl' : 'text-3xl'}`}>Withdraw to bank</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className='flex-1'
            >
                <ScrollView 
                    className='flex-1'
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className='px-6 py-3 border-b-4 border-border/40'>
                        <CustomInput
                            label='Amount'
                            value={amount}
                            error={errors?.amount}
                            setValue={setAmount}
                            prefix='₦'
                            keyboardType='numeric'
                        />

                        <View className="flex-row items-center gap-2 ">
                            <Feather name="info" size={16} color="#757575" />
                            <Text className={`font-normal text-secondary text-sm ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>Available amount to withdraw: <Text className={`font-normal text-primary ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>{formatPrice(wallet?.availableBalance ?? 0)}</Text></Text>
                        </View>
                    </View>

                    <View className='px-6 py-3 border-b-4 border-border/40'>
                        <View className='flex-row items-center justify-between w-full'>
                            <Text className={`font-normal text-primary ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>Saved bank</Text>
                            <Link href='/Banks/AddOrEditBankScreen' asChild>
                                <Pressable className='flex-row items-center gap-2 pl-4 py-2 rounded-full bg-primary-light'>
                                    <AntDesign name="plus" size={14} color="white" />
                                    <Text className={`font-normal min-w-20 text-white ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>Add bank</Text>
                                </Pressable>
                            </Link>
                        </View>
                    </View>

                    <View className='px-6 py-3 pt-6'>
                        <View className='flex-row items-center gap-2 mb-4'>
                            <Feather name="info" size={14} color="#757575" />
                            <Text className={`font-normal text-secondary ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>
                                Please select a bank account below.
                            </Text>
                        </View>
                        {(!bankAccounts?.data || bankAccounts.data.length === 0) && (
                            <Text className={`font-normal text-secondary text-center pb-4 ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>
                                No saved bank accounts. Please add a bank to withdraw.
                            </Text>
                        )}
                        {
                            bankAccounts?.data?.map((bankAccount) => (
                                <BankCard
                                    isSelected={selectedBankAccountId === bankAccount.id}
                                    onSelect={() => {
                                        if(bankAccount.id === selectedBankAccountId) return;
                                        setSelectedBankAccountId(bankAccount.id)
                                    }}
                                    key={`bank_account_${bankAccount.id}`}
                                    bankAccount={bankAccount}
                                />
                            )) 
                        }
                        {
                            errors?.bankAccountId && (
                                <Text className={`font-normal text-red-500 text-center pb-4 ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>{errors.bankAccountId}</Text>
                            )
                        }
                    </View>

                    <View className='mt-auto px-6'>
                        <CustomButton
                            buttonText="Withdraw"
                            onPressHandler={handleWithdraw}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}

export default WithdrawalScreen
