import { View, Text, Pressable, Platform } from 'react-native'
import { useState } from 'react'
import SafeAreaView from '@/components/ui/common/NativeStyledSafeAreaView'
import { Link, useRouter } from 'expo-router';
import CustomInput from '@/components/ui/common/CustomInput';
import Feather from '@expo/vector-icons/Feather';
import { formatPrice } from '@/utils/priceFormatter';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import BankCard from '@/components/Banks/BankCard';

const WithdrawalScreen = () => {
    const router = useRouter();

    const [amount, setAmount] = useState('');

    const goBack = () => {
        router.back();
    }

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <View className='px-6 pb-4 pt-2.5 flex-row gap-4 items-center border-border/40 border-b-4'>
                <Pressable onPress={goBack} className='p-2 border rounded-full border-border bg-light'>
                    <Feather name="arrow-left" size={18} color="#1E1E1E" />
                </Pressable>
                <Text className={`text-primary-light ${Platform.OS === 'ios' ? 'text-2xl' : 'text-3xl'}`}>Withdraw to bank</Text>
            </View>

            {/* amount */}
            <View className='px-6 py-3 border-b-4 border-border/40'>
                <CustomInput
                    label='Amount'
                    value={amount}
                    setValue={setAmount}
                    prefix='₦'
                    keyboardType='numeric'
                />

                <View className="flex-row items-center gap-2 ">
                    <Feather name="info" size={16} color="#757575" />
                    <Text className={`font-normal text-secondary text-sm ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>Available amount to withdraw: <Text className={`font-normal text-primary ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>{formatPrice(36000)}</Text></Text>
                </View>
            </View>

            {/* saved bank */}
            <View className='px-6 py-3 border-b-4 border-border/40'>
                <View className='flex-row items-center justify-between'>
                    <Text className={`font-normal text-primary ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>Saved bank</Text>
                    {/* open modal to add new bank */}
                    <Link href='/Banks/AddOrEditBankScreen' asChild>
                        <Pressable className='flex-row items-center gap-2 px-4 py-2 rounded-full bg-primary-light'>
                            <AntDesign name="plus" size={16} color="white" />
                            <Text className={`font-normal text-white ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>New bank</Text>
                        </Pressable>
                    </Link>
                </View>
            </View>

            {/* banks */}
            <View className='px-6 py-3 pt-6'>
                <BankCard 
                    name='Opay Digital Services Limited (Opay)'
                    accountNumber='1111111111'
                    isSelected={true}
                />

            </View>

        </SafeAreaView>
    )
}

export default WithdrawalScreen