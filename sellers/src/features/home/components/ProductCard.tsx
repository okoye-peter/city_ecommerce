import { View, Text, Platform } from 'react-native'
import React from 'react'
import { Image } from 'expo-image';
import { format } from 'date-fns';
import { formatPrice } from '@/src/utils/priceFormatter';
import { StatusType } from '@/src/utils/statusClass';
import StatusCard from '@/src/components/ui/StatusCard';

interface Props {
    productImageUrl?: string;
    productName: string;
    orderTotal: number;
    orderRef: string;
    date: string;
    status: StatusType;
    className?: string;
}

const ProductCard = ({productImageUrl, productName, orderTotal, orderRef, date, status, className}: Props) => {
    return (
        <View className={`w-full flex-row gap-2 items-center py-4 ${className}`}>
            <View className='w-[88px] h-[88px] rounded-lg overflow-hidden'>
                {productImageUrl && (
                    <Image
                        source={{ uri: productImageUrl }}
                        style={{ width: '100%', height: '100%' }}
                        contentFit='cover'
                        transition={200}
                    />
                )}
            </View>
            <View className='flex-1'>
                <Text numberOfLines={1} className={`font-normal font-Inter text-primary ${Platform.OS === 'ios' ? 'text-lg' : 'text-xl'}`}>{productName}</Text>
                <View className='flex-row items-center gap-1 mb-2'>
                    <Text numberOfLines={1} className={`font-normal font-Inter pr-1.5 border-r border-r-border/60 text-secondary ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>Order-{orderRef}</Text>
                    <Text numberOfLines={1} className={`font-normal font-Inter pl-1.5 text-secondary ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>{format(date, 'do MMM, yyyy')}</Text>
                </View>
                <View className='flex-row items-center justify-between'>
                    <Text className={`font-normal font-Inter text-body ${Platform.OS === 'ios' ? 'text-lg' : 'text-xl'}`}>{formatPrice(orderTotal)}</Text>
                    <StatusCard status={status} />
                </View>
            </View>
        </View>
    )
}

export default ProductCard
