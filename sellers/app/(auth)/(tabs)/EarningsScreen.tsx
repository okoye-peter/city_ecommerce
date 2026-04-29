import { View, Text, Platform, FlatList } from 'react-native'
import SafeAreaView from '@/components/ui/common/NativeStyledSafeAreaView'

import EarningSummaryCard from '@/components/EarningScreen/EarningSummaryCard';
import CustomButton from '@/components/ui/common/CustomButton';
import { formatPrice } from '@/utils/priceFormatter';
import TransactionCard from '@/components/EarningScreen/TransactionCard';
import { useRouter } from 'expo-router';

interface Transaction {
    id: string;
    title: string;
    createdAt: string;
    amount: number;
    type: 'sale' | 'withdrawal';
    status: 'pending' | 'success' | 'failed';
}

const TRANSACTIONS: Transaction[] = [
    {
        id: '1',
        title: 'Sale - Leather Bucket Bag',
        createdAt: '2026-04-15 12:36:38',
        amount: 23750,
        type: 'sale',
        status: 'pending',
    },
    {
        id: '2',
        title: 'Platform fee (5%)',
        createdAt: '2026-04-15 12:36:38',
        amount: 1250,
        type: 'withdrawal',
        status: 'success',
    },
    {
        id: '3',
        title: 'Sale - Premium Ankara Wax Print - 6 Yards',
        createdAt: '2026-04-14 09:12:45',
        amount: 14250,
        type: 'sale',
        status: 'failed',
    },
    {
        id: '4',
        title: 'Platform fee (5%)',
        createdAt: '2026-04-14 15:40:22',
        amount: 750,
        type: 'withdrawal',
        status: 'pending',
    },
    {
        id: '5',
        title: 'Sale - Premium Ankara Wax Print - 6 Yards',
        createdAt: '2026-04-13 11:20:10',
        amount: 14250,
        type: 'sale',
        status: 'success',
    },
    {
        id: '6',
        title: 'Platform fee (5%)',
        createdAt: '2026-04-13 18:05:55',
        amount: 750,
        type: 'withdrawal',
        status: 'failed',
    },
    {
        id: '7',
        title: 'Sale - Premium Ankara Wax Print - 6 Yards',
        createdAt: '2026-04-12 14:15:30',
        amount: 14250,
        type: 'sale',
        status: 'pending',
    },
    {
        id: '8',
        title: 'Platform fee (5%)',
        createdAt: '2026-04-12 20:30:15',
        amount: 750,
        type: 'withdrawal',
        status: 'success',
    },
];

const EarningsScreen = () => {
    const router = useRouter();
    
    const renderHeader = () => (
        <View>
            <View className="mb-3">
                <Text className={`text-primary font-Inter-bold mt-6 px-6 ${Platform.OS === 'ios' ? 'text-2xl' : 'text-3xl'}`}>
                    Earnings
                </Text>
            </View>
            <View className='pb-6 border-b-4 border-border/30 px-6 gap-6'>
                <EarningSummaryCard trend='up' percentage={50} />

                {/* Withdraw */}
                <CustomButton 
                    buttonText={`Withdraw ${formatPrice(50000)}`}
                    onPressHandler={() => { router.push('/(auth)/Banks/WithdrawalScreen') }}
                />
            </View>
            
            <View className="px-6 pt-6 pb-2">
                <Text className={`text-primary font-Inter-bold ${Platform.OS === 'ios' ? 'text-xl' : 'text-2xl'}`}>
                    Transactions
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <FlatList
                data={TRANSACTIONS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View className=" px-6">
                        <TransactionCard 
                            id={item.id}
                            title={item.title}
                            dateTime={item.createdAt}
                            amount={item.amount}
                            type={item.type}
                            status={item.status}
                        />
                    </View>
                )}
                ListHeaderComponent={renderHeader}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </SafeAreaView>
    )
}

export default EarningsScreen