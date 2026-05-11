import { View, Text, Pressable, Platform, StyleSheet } from 'react-native'
import React, { useEffect, useMemo, useRef } from 'react'
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import CustomBottomSheet from '@/src/components/ui/CustomBottomSheet';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { formatPrice } from '@/src/utils/priceFormatter';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { SellerTransaction, SellerTransactionType } from '@/src/types';

const TYPE_CONFIG: Record<SellerTransactionType, {
    label: string;
    credit: boolean;
    badgeClass: string;
    iconName: string;
    iconColor: string;
    bgClass: string;
}> = {
    ESCROW_CREDIT: {
        label: 'Sale Credit',
        credit: true,
        badgeClass: 'bg-green-50 border-green-500',
        iconName: 'arrow-trend-up',
        iconColor: '#15803d',
        bgClass: 'bg-green-100',
    },
    ESCROW_RELEASE: {
        label: 'Escrow Released',
        credit: true,
        badgeClass: 'bg-blue-50 border-blue-500',
        iconName: 'circle-check',
        iconColor: '#1d4ed8',
        bgClass: 'bg-blue-100',
    },
    WITHDRAWAL: {
        label: 'Withdrawal',
        credit: false,
        badgeClass: 'bg-red-50 border-red-500',
        iconName: 'arrow-trend-down',
        iconColor: '#b91c1c',
        bgClass: 'bg-red-100',
    },
};

interface Row {
    label: string;
    value: string;
}

interface Props {
    transaction: SellerTransaction;
    onClose: () => void;
}

const DetailRow = ({ label, value }: Row) => (
    <View className='flex-row items-start justify-between gap-4'>
        <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal text-secondary`}>
            {label}
        </Text>
        <Text
            className={`flex-1 text-right ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal text-primary`}
            selectable
        >
            {value}
        </Text>
    </View>
);

const ViewTransactionBottomSheet = ({ transaction, onClose }: Props) => {
    const { id, type, amount, createdAt, description, userBank, reference, status } = transaction;
    const config = TYPE_CONFIG[type];
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['60%', '85%'], []);

    useEffect(() => {
        bottomSheetRef.current?.present();
    }, []);

    const amountTextClass = config.credit ? 'text-green-800' : 'text-red-800';
    const sign = config.credit ? '+' : '-';

    return (
        <CustomBottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            handleComponent={null}
            onDismiss={onClose}
            index={0}
            backgroundStyle={{ borderRadius: 24 }}
        >
            <BottomSheetScrollView showsVerticalScrollIndicator={false}>
                <View className='relative rounded-t-3xl p-5 pb-8'>
                    <Text className={`text-primary font-inter-semibold ${Platform.OS === 'ios' ? 'text-xl' : 'text-2xl'}`}>
                        Transaction Details
                    </Text>
                    <Pressable
                        onPress={() => bottomSheetRef.current?.dismiss()}
                        className='absolute items-center justify-center w-8 h-8 border rounded-full top-4 right-4 border-border bg-light'
                    >
                        <EvilIcons name="close" size={18} color="black" />
                    </Pressable>

                    {/* Icon / product image */}
                    <View className="items-center pt-6 pb-4 gap-3">
                        <View className={`items-center justify-center w-20 h-20 rounded-full ${config.bgClass}`}>
                            <FontAwesome6 name={config.iconName as any} size={26} color={config.iconColor} />
                        </View>

                        <Text className={clsx('font-inter-semibold', Platform.OS === 'ios' ? 'text-3xl' : 'text-4xl', amountTextClass)}>
                            {sign}{formatPrice(amount)}
                        </Text>

                        {/* Type badge */}
                        <View className={clsx('flex-row items-center gap-1.5 px-3 py-1 rounded-full border', config.badgeClass)}>
                            <MaterialCommunityIcons
                                name={type === 'ESCROW_CREDIT' ? 'arrow-up-circle-outline' : type === 'ESCROW_RELEASE' ? 'lock-open-outline' : 'bank-transfer-out'}
                                size={14}
                                color={config.iconColor}
                            />
                            <Text className={clsx('font-inter-medium text-sm', config.credit ? 'text-green-700' : 'text-red-700')}>
                                {config.label}
                            </Text>
                        </View>
                    </View>

                    {/* Details */}
                    <View className='gap-3.5 border-t border-border pt-4'>
                        {description ? (
                            <DetailRow label="Description" value={description} />
                        ) : null}

                        {userBank ? (
                            <DetailRow label="Bank Account" value={`${userBank.bank?.name} •••${userBank.accountNumber.slice(-4)}`} />
                        ) : null}

                        <DetailRow label="Transaction ID" value={`#${reference}`} />

                        {type === 'WITHDRAWAL' && status ? (
                            <View className='flex-row items-center justify-between'>
                                <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal text-secondary`}>
                                    Withdrawal Status
                                </Text>
                                <View style={[
                                    styles.statusBadge,
                                    status === 'COMPLETED'  && styles.statusCompleted,
                                    status === 'PENDING'    && styles.statusPending,
                                    status === 'PROCESSING' && styles.statusPending,
                                    status === 'FAILED'     && styles.statusFailed,
                                ]}>
                                    <View style={[
                                        styles.statusDot,
                                        status === 'COMPLETED'  && styles.dotCompleted,
                                        status === 'PENDING'    && styles.dotPending,
                                        status === 'PROCESSING' && styles.dotPending,
                                        status === 'FAILED'     && styles.dotFailed,
                                    ]} />
                                    <Text style={[
                                        styles.statusText,
                                        status === 'COMPLETED'  && styles.textCompleted,
                                        status === 'PENDING'    && styles.textPending,
                                        status === 'PROCESSING' && styles.textPending,
                                        status === 'FAILED'     && styles.textFailed,
                                    ]}>
                                        {status.charAt(0) + status.slice(1).toLowerCase()}
                                    </Text>
                                </View>
                            </View>
                        ) : null}

                        <DetailRow
                            label="Date & Time"
                            value={format(new Date(createdAt), 'LLL dd, yyyy • HH:mm')}
                        />
                    </View>
                </View>
            </BottomSheetScrollView>
        </CustomBottomSheet>
    );
};

const styles = StyleSheet.create({
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '500',
    },
    // Completed — green
    statusCompleted: { backgroundColor: '#dcfce7' },
    dotCompleted:    { backgroundColor: '#16a34a' },
    textCompleted:   { color: '#15803d' },
    // Pending / Processing — amber
    statusPending:   { backgroundColor: '#fef9c3' },
    dotPending:      { backgroundColor: '#ca8a04' },
    textPending:     { color: '#a16207' },
    // Failed — red
    statusFailed:    { backgroundColor: '#fee2e2' },
    dotFailed:       { backgroundColor: '#dc2626' },
    textFailed:      { color: '#b91c1c' },
});

export default ViewTransactionBottomSheet;
