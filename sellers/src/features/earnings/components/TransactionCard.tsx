import { View, Text, Platform, Pressable } from 'react-native'
import React, { useState } from 'react'
import { formatPrice } from '@/src/utils/priceFormatter';
import ViewTransactionBottomSheet from './ViewTransactionBottomSheet';
import { format } from 'date-fns';

interface TransactionCardProps {
    id: string;
    title: string;
    dateTime: string;
    amount: number;
    type: 'sale' | 'withdrawal';
    status: 'pending' | 'success' | 'failed';
}

const TransactionCard = ({ id, title, dateTime, amount, type, status }: TransactionCardProps) => {
    const isCredit = type === 'sale';
    const amountColor = isCredit ? 'text-success-dark' : 'text-error-dark';
    const sign = isCredit ? '+' : '-';
    const [isViewTransactionBottomSheetOpen, setIsViewTransactionBottomSheetOpen] = useState(false);

    return (
        <>
            <Pressable
                onPress={() => setIsViewTransactionBottomSheetOpen(true)}
                className="flex-row items-center justify-between py-4 border-b border-border/30"
            >
                <View className="flex-1 mr-4">
                    <Text
                        className={`font-inter-medium text-primary mb-1 ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}
                        numberOfLines={1}
                    >
                        {title}
                    </Text>
                    <Text className="text-sm font-inter-regular text-secondary">
                        {format(dateTime, 'LLL dd, yyyy • HH:mm')}
                    </Text>
                </View>
                <View>
                    <Text className={`font-inter-semibold ${amountColor} ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>
                        {sign}{formatPrice(Math.abs(amount))}
                    </Text>
                </View>
            </Pressable>

            {isViewTransactionBottomSheetOpen && (
                <ViewTransactionBottomSheet
                    type={type}
                    amount={amount}
                    dateTime={format(dateTime, 'LLL dd, yyyy • HH:mm')}
                    description={title}
                    transactionId={id}
                    status={status}
                    onClose={() => setIsViewTransactionBottomSheetOpen(false)}
                />
            )}
        </>
    )
}

export default TransactionCard
