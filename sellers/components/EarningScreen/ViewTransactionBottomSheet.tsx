import { View, Text, Pressable, Platform } from 'react-native'
import React, { useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import CustomBottomSheet from '../ui/common/CustomBottomSheet';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { formatPrice } from '@/utils/priceFormatter';
import clsx from 'clsx';


interface Props {
    type: 'sale' | 'withdrawal';
    amount: number;
    dateTime: string;
    description: string;
    transactionId: string;
    orderId?: string;
    onClose: () => void;
    status: 'pending' | 'success' | 'failed'
}


const ViewTransactionBottomSheet = ({ type, amount, dateTime, description, transactionId, orderId, onClose, status }: Props) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const handleCloseBottomSheet = () => {
        bottomSheetRef.current?.dismiss()
    }

    const snapPoints = useMemo(() => ['55%', '70%'], []);

    useEffect(() => {
        bottomSheetRef.current?.present();
    }, []);


    return (
        <CustomBottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            handleComponent={null}
            onDismiss={onClose}
            index={0}
            backgroundStyle={{ borderRadius: 24 }}
        >
            <View className='relative flex-1 rounded-t-3xl p-5'>
                <Text className={`text-primary ${Platform.OS === 'ios' ? 'text-xl' : 'text-2xl'}`}>Transaction details</Text>
                {/* close bottom sheet */}
                <Pressable
                    onPress={handleCloseBottomSheet}
                    className='absolute items-center justify-center w-8 h-8 border rounded-full top-4 right-4 border-border bg-light'
                >
                    <EvilIcons name="close" size={18} color="black" />
                </Pressable>

                {/*  */}
                <View className="items-center justify-center gap-8 pt-10 pb-6">
                    <View className={`items-center justify-center w-20 h-20 rounded-full ${type === 'sale' ? 'bg-green-100' : 'bg-red-100'}`}>
                        { type === 'sale' && (<FontAwesome6 name="arrow-trend-up" size={24} color="green" />) }
                        { type === 'withdrawal' && (<FontAwesome6 name="arrow-trend-down" size={24} color="red" />) }
                    </View>
                    <Text className={clsx('font-semibold', Platform.OS === 'ios'? 'text-2xl' : 'text-3xl', type === 'sale' ? 'text-green-800' : 'text-red-800')}>{type === 'sale' ? '+' : '-'}{formatPrice(amount)}</Text>
                </View>

                <View className='gap-4 border-t border-border pt-3'>
                    <View className='flex-row items-start justify-between gap-4'>
                        <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal text-secondary`}>Description</Text>
                        <Text className={`flex-1 text-right ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal text-primary capitalize break-all`}>{description}</Text>
                    </View>

                    <View className='flex-row items-start justify-between gap-4'>
                        <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal text-secondary`}>Transaction ID</Text>
                        <Text className={`flex-1 text-right ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal text-primary capitalize`}>{transactionId}</Text>
                    </View>

                    {orderId && (
                        <View className='flex-row items-start justify-between gap-4'>
                            <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal text-secondary`}>Order ID</Text>
                            <Text className={`flex-1 text-right ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal text-primary capitalize`}>{orderId}</Text>
                        </View>
                    )}

                    <View className='flex-row items-start justify-between gap-4'>
                        <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal text-secondary`}>Type</Text>
                        <Text className={`flex-1 text-right ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal text-primary capitalize`}>{type}</Text>
                    </View>
                    
                    <View className='flex-row items-center justify-between'>
                        <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal text-secondary`}>Status</Text>
                        <Text className={clsx(
                            'font-medium capitalize px-3.5 py-1 rounded-full',
                            Platform.OS === 'ios' ? 'text-sm' : 'text-base',
                            status === 'pending' && 'text-yellow-500 bg-yellow-50 border border-yellow-500',
                            status === 'success' && 'text-green-500 bg-green-50 border border-green-500',
                            status === 'failed' && 'text-red-500 bg-red-50 border border-red-500'
                        )}>
                            {status}
                        </Text>
                    </View>
                    
                    <View className='flex-row items-start justify-between gap-4'>
                        <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal text-secondary`}>Date & Time</Text>
                        <Text className={`flex-1 text-right ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal text-primary capitalize`}>{dateTime}</Text>
                    </View>
                </View> 
            </View>
        </CustomBottomSheet>
    )
}

export default ViewTransactionBottomSheet