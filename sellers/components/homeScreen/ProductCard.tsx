import { View, Text, Platform } from 'react-native'
import React from 'react'
import { Image } from 'expo-image';
import { format } from 'date-fns';

interface Props {
    productImageUrl?: string;
    productName: string;
    orderTotal: number;
    orderRef: string;
    date: string;
    status: string;
}

const ProductCard = ({productImageUrl, productName, orderTotal, orderRef, date}: Props) => {
    return (
        <View className='w-full flex-row gap-2 items-center'>
            <View className='w-[45px] h-[450px] rounded-lg overflow-hidden'>
                {productImageUrl && (
                    <Image
                        source={{ uri: productImageUrl }}
                        style={{ width: '100%', height: '100%' }}
                        contentFit='contain'
                        transition={200}
                    />
                )}
            </View>
            <View className='flex-1'>
                <Text className={`font-medium font-Inter text-primary ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>{productName}</Text>
                <View className='flex-row items-center gap-1'>
                    <Text className={`font-medium font-Inter text-primary ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>{orderRef}</Text>
                    <Text className={`font-medium font-Inter text-primary ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>{format(date, 'dd/MM/YYYY')}</Text>
                </View>
            </View>
        </View>
    )
}

export default ProductCard