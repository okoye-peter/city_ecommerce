import { View, Text, Platform, FlatList, Pressable, Modal } from 'react-native'
import React, { useMemo, useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import SafeAreaView from '@/src/components/ui/NativeStyledSafeAreaView'

import EarningSummaryCard from '@/src/features/earnings/components/EarningSummaryCard';
import CustomButton from '@/src/components/ui/CustomButton';
import { formatPrice } from '@/src/utils/priceFormatter';
import TransactionCard from '@/src/features/earnings/components/TransactionCard';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

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

type SortOrder = 'desc' | 'asc';
type ActivePicker = 'start' | 'end' | null;

const EarningsScreen = () => {
    const router = useRouter();

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [activePicker, setActivePicker] = useState<ActivePicker>(null);
    const [tempDate, setTempDate] = useState<Date>(new Date());

    const formatDateLabel = (date: Date | null, placeholder: string) => {
        if (!date) return placeholder;
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const openPicker = (target: 'start' | 'end') => {
        const current = target === 'start' ? startDate : endDate;
        setTempDate(current ?? new Date());
        setActivePicker(target);
    };

    const handleValueChange = (_event: unknown, date: Date) => {
        if (Platform.OS === 'android') {
            setActivePicker(null);
            if (activePicker === 'start') setStartDate(date);
            else if (activePicker === 'end') setEndDate(date);
        } else {
            setTempDate(date);
        }
    };

    const handleDismiss = () => setActivePicker(null);

    const confirmIOSPicker = () => {
        if (activePicker === 'start') setStartDate(tempDate);
        else if (activePicker === 'end') setEndDate(tempDate);
        setActivePicker(null);
    };

    const clearDates = () => {
        setStartDate(null);
        setEndDate(null);
    };

    const filteredTransactions = useMemo(() => {
        let result = [...TRANSACTIONS];

        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            result = result.filter(t => new Date(t.createdAt) >= start);
        }

        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            result = result.filter(t => new Date(t.createdAt) <= end);
        }

        result.sort((a, b) => {
            const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            return sortOrder === 'desc' ? -diff : diff;
        });

        return result;
    }, [startDate, endDate, sortOrder]);

    const hasDateFilter = startDate !== null || endDate !== null;

    const renderHeader = () => (
        <View>
            <View className="mb-3">
                <Text className={`text-primary font-Inter-bold mt-6 px-6 ${Platform.OS === 'ios' ? 'text-2xl' : 'text-3xl'}`}>
                    Earnings
                </Text>
            </View>
            <View className='gap-6 px-6 pb-6 border-b-4 border-border/30'>
                <EarningSummaryCard trend='up' percentage={50} />

                <CustomButton
                    buttonText={`Withdraw ${formatPrice(50000)}`}
                    onPressHandler={() => { router.push('/(auth)/Banks/WithdrawalScreen') }}
                />
            </View>

            <View className="px-6 pt-6 pb-3">
                <Text className={`text-primary font-Inter-bold mb-3 ${Platform.OS === 'ios' ? 'text-xl' : 'text-2xl'}`}>
                    Transactions
                </Text>

                <View className="flex-row items-center gap-2">
                    <Pressable
                        onPress={() => openPicker('start')}
                        className={`flex-1 flex-row items-center justify-between border rounded-lg px-3 py-2 ${activePicker === 'start' ? 'border-primary bg-primary/5' : 'border-border'}`}
                    >
                        <Text className={`font-inter ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'} ${startDate ? 'text-primary' : 'text-secondary'}`}>
                            {formatDateLabel(startDate, 'From')}
                        </Text>
                        <Feather name="calendar" size={13} color={activePicker === 'start' ? '#2C2C2C' : '#9CA3AF'} />
                    </Pressable>

                    <View className="w-3 h-px bg-border" />

                    <Pressable
                        onPress={() => openPicker('end')}
                        className={`flex-1 flex-row items-center justify-between border rounded-lg px-3 py-2 ${activePicker === 'end' ? 'border-primary bg-primary/5' : 'border-border'}`}
                    >
                        <Text className={`font-inter ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'} ${endDate ? 'text-primary' : 'text-secondary'}`}>
                            {formatDateLabel(endDate, 'To')}
                        </Text>
                        <Feather name="calendar" size={13} color={activePicker === 'end' ? '#2C2C2C' : '#9CA3AF'} />
                    </Pressable>

                    <Pressable
                        onPress={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                        className="flex-row items-center gap-1 border border-border rounded-lg px-2.5 py-2"
                    >
                        <Feather
                            name={sortOrder === 'desc' ? 'arrow-down' : 'arrow-up'}
                            size={13}
                            color="#2C2C2C"
                        />
                        <Text className={`font-inter ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'} text-primary`}>
                            {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
                        </Text>
                    </Pressable>

                    {hasDateFilter && (
                        <Pressable onPress={clearDates} className="p-2 border rounded-lg border-border">
                            <Feather name="x" size={13} color="#9CA3AF" />
                        </Pressable>
                    )}
                </View>

                {Platform.OS === 'android' && activePicker !== null && (
                    <DateTimePicker
                        value={tempDate}
                        mode="date"
                        display="default"
                        onValueChange={handleValueChange}
                        onDismiss={handleDismiss}
                        maximumDate={new Date()}
                    />
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView edges={['top', 'left', 'right']} className='flex-1 bg-white'>
            <FlatList
                data={filteredTransactions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View className="px-6">
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

            {Platform.OS === 'ios' && (
                <Modal
                    transparent
                    visible={activePicker !== null}
                    animationType="slide"
                    onRequestClose={() => setActivePicker(null)}
                >
                    <Pressable
                        className="flex-1 bg-black/40"
                        onPress={() => setActivePicker(null)}
                    />
                    <View className="pb-8 bg-white rounded-t-3xl">
                        <View className="flex-row items-center justify-between px-5 pt-4 pb-2 border-b border-border">
                            <Pressable onPress={() => setActivePicker(null)} hitSlop={8}>
                                <Text className={`font-inter text-secondary ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>Cancel</Text>
                            </Pressable>
                            <Text className={`font-inter-semibold text-primary ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>
                                {activePicker === 'start' ? 'From date' : 'To date'}
                            </Text>
                            <Pressable onPress={confirmIOSPicker} hitSlop={8}>
                                <Text className={`font-inter-semibold text-primary ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>Done</Text>
                            </Pressable>
                        </View>

                        <DateTimePicker
                            value={tempDate}
                            mode="date"
                            display="spinner"
                            onValueChange={handleValueChange}
                            maximumDate={new Date()}
                            style={{ height: 200 }}
                        />
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
};

export default EarningsScreen;
