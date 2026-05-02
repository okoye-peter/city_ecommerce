import { View, Text, Platform } from 'react-native'
import React, { useState } from 'react'
import { Image } from 'expo-image'
import { formatPrice } from '@/src/utils/priceFormatter'
import Skeleton from '@/src/components/ui/Skeleton'

const ProductCard = () => {
    const [isImageLoading, setIsImageLoading] = useState(true);

    return (
        <View className='flex-row gap-x-4'>
            <View className='h-[60px] w-[60px] rounded-lg overflow-hidden relative'>
                {isImageLoading && (
                    <Skeleton
                        width={60}
                        height={60}
                        borderRadius={8}
                        style={{ position: 'absolute', zIndex: 10 }}
                    />
                )}
                <Image
                    source={{
                        uri: 'https://i.pinimg.com/736x/6e/ad/26/6ead26067f211de57721368b176101b0.jpg'
                    }}
                    style={{ width: '100%', height: '100%' }}
                    onLoadStart={() => setIsImageLoading(true)}
                    onLoad={() => setIsImageLoading(false)}
                    transition={300}
                />
            </View>

            <View className='flex-1'>
                <View className='flex-row gap-x-4 justify-between items-start mb-1'>
                    <Text numberOfLines={3} className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal text-primary font-Inter flex-1`}>Premium Ankara Wax Print - 6 Yards</Text>
                    <Text numberOfLines={1} className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal text-primary font-Inter`}>{formatPrice(15000)}</Text>
                </View>
                <Text className={`${Platform.OS === 'ios' ? 'text-sm' : 'text-base'} font-normal text-secondary font-Inter`}>Quantity: 1</Text>
            </View>
        </View>
    )
}

export default ProductCard
