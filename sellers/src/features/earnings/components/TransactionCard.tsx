import { View, Text, Platform, Pressable } from 'react-native'
import React, { useState } from 'react'
import { formatPrice } from '@/src/utils/priceFormatter';
import ViewTransactionBottomSheet from './ViewTransactionBottomSheet';
import { format } from 'date-fns';
import { SellerTransaction, SellerTransactionType } from '@/src/types';

const TYPE_LABELS: Record<SellerTransactionType, string> = {
    ESCROW_CREDIT: 'Sale Credit',
    ESCROW_RELEASE: 'Escrow Released',
    WITHDRAWAL: 'Withdrawal',
};

const isCredit = (type: SellerTransactionType) => type !== 'WITHDRAWAL';

interface TransactionCardProps {
    transaction: SellerTransaction;
}

const TransactionCard = ({ transaction }: TransactionCardProps) => {
    const { type, amount, createdAt, description, userBank } = transaction;
    const credit = isCredit(type);
    const title = TYPE_LABELS[type];
    const subtitle = description || format(createdAt, 'LLL dd, yyyy • HH:mm');
    const amountColor = credit ? 'text-success-dark' : 'text-error-dark';
    const sign = credit ? '+' : '-';
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Pressable
                onPress={() => setIsOpen(true)}
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
                        {subtitle}
                    </Text>
                </View>
                <Text className={`font-inter-semibold ${amountColor} ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>
                    {sign}{formatPrice(Math.abs(amount))}
                </Text>
            </Pressable>

            {isOpen && (
                <ViewTransactionBottomSheet
                    transaction={transaction}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default TransactionCard;
