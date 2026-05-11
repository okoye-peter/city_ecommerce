import { View, Text, Platform, FlatList, Pressable, Modal, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import SafeAreaView from '@/src/components/ui/NativeStyledSafeAreaView'

import EarningSummaryCard from '@/src/features/earnings/components/EarningSummaryCard';
import CustomButton from '@/src/components/ui/CustomButton';
import { formatPrice } from '@/src/utils/priceFormatter';
import TransactionCard from '@/src/features/earnings/components/TransactionCard';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { useGetWalletTransactions, useGetWallet } from '../queries';
import { SellerTransaction } from '@/src/types';

type SortOrder = 'desc' | 'asc';
type ActivePicker = 'start' | 'end' | null;

const EarningsScreen = () => {
    const router = useRouter();

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [activePicker, setActivePicker] = useState<ActivePicker>(null);
    const [tempDate, setTempDate] = useState<Date>(new Date());

    const queryParams = useMemo(() => ({
        limit: 20,
        from: startDate ? startDate.toISOString() : undefined,
        to: endDate ? endDate.toISOString() : undefined,
        order: sortOrder,
    }), [startDate, endDate, sortOrder]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        refetch,
        isRefetching,
    } = useGetWalletTransactions(queryParams);

    const { refetch: refetchWallet, isRefetching: isRefetchingWallet } = useGetWallet();

    const handleRefresh = useCallback(async () => {
        await Promise.all([
            refetch(),
            refetchWallet()
        ]);
    }, [refetch, refetchWallet]);

    const transactions = useMemo(
        () => data?.pages.flatMap(p => p.data) ?? [],
        [data],
    );

    const formatDateLabel = (date: Date | null, placeholder: string) => {
        if (!date) return placeholder;
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const openPicker = (target: 'start' | 'end') => {
        const current = target === 'start' ? startDate : endDate;
        setTempDate(current ?? new Date());
        setActivePicker(target);
    };

    const handleValueChange = (_event: unknown, date?: Date) => {
        if (!date) return;
        if (Platform.OS === 'android') {
            setActivePicker(null);
            if (activePicker === 'start') setStartDate(date);
            else if (activePicker === 'end') setEndDate(date);
        } else {
            setTempDate(date);
        }
    };

    const confirmIOSPicker = () => {
        if (activePicker === 'start') setStartDate(tempDate);
        else if (activePicker === 'end') setEndDate(tempDate);
        setActivePicker(null);
    };

    const clearDates = () => {
        setStartDate(null);
        setEndDate(null);
    };

    const hasDateFilter = startDate !== null || endDate !== null;

    const renderItem = ({ item }: { item: SellerTransaction }) => (
        <View className="px-6">
            <TransactionCard transaction={item} />
        </View>
    );

    const renderFooter = () => {
        if (!isFetchingNextPage) return null;
        return (
            <View className="items-center py-4">
                <ActivityIndicator size="small" color="#2C2C2C" />
            </View>
        );
    };

    const renderEmpty = () => {
        if (isLoading) {
            return (
                <View className="items-center py-16">
                    <ActivityIndicator size="large" color="#2C2C2C" />
                </View>
            );
        }
        if (isError) {
            return (
                <View className="items-center px-6 py-16">
                    <Text className={`text-secondary text-center ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>
                        Failed to load transactions. Pull to refresh.
                    </Text>
                </View>
            );
        }
        return (
            <View className="items-center px-6 py-16">
                <Text className={`text-secondary text-center ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>
                    No transactions yet
                </Text>
            </View>
        );
    };

    const renderHeader = () => (
        <View>
            <View className="mb-3">
                <Text className={`text-primary font-Inter-bold mt-6 px-6 ${Platform.OS === 'ios' ? 'text-2xl' : 'text-3xl'}`}>
                    Earnings
                </Text>
            </View>
            <View className='gap-6 px-6 pb-6 border-b-4 border-border/30'>
                <EarningSummaryCard />

                <CustomButton
                    buttonText={`Withdraw`}
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
                        maximumDate={new Date()}
                    />
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView edges={['top', 'left', 'right']} className='flex-1 bg-white'>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                onEndReached={() => { if (hasNextPage) fetchNextPage(); }}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshControl={
                    <RefreshControl 
                        refreshing={isRefetching || isRefetchingWallet} 
                        onRefresh={handleRefresh} 
                    />
                }
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
