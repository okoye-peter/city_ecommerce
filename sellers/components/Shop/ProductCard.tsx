import { View, Text, Platform, Pressable } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { formatPrice } from '@/utils/priceFormatter'
import clsx from 'clsx';
import Feather from '@expo/vector-icons/Feather';
import Skeleton from '../ui/common/Skeleton';

interface ProductCardProps {
    image: string;
    name: string;
    price: number;
    quantity: number;
}

const ProductCard = ({ image, name, price, quantity }: ProductCardProps) => {
    const [isImageLoading, setIsImageLoading] = React.useState(true);

    return (
        <View className='flex-row items-center gap-4'>
            <View className='h-[88px] w-[88px] rounded-2xl overflow-hidden relative'>
                {isImageLoading && (
                    <Skeleton 
                        width={88} 
                        height={88} 
                        borderRadius={16} 
                        style={{ position: 'absolute', zIndex: 10 }} 
                    />
                )}
                <Image
                    source={{ uri: image }}
                    style={{ width: '100%', height: '100%' }}
                    onLoadStart={() => setIsImageLoading(true)}
                    onLoad={() => setIsImageLoading(false)}
                    transition={300}
                    contentFit='cover'
                />
            </View>
            <View className='flex-1'>
                {/* product name */}
                <Text numberOfLines={1} className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal font-Inter text-primary mb-1.5`}>{name}</Text>
                {/* product price */}
                <Text numberOfLines={1} className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal font-Inter text-primary mb-1.5`}>{formatPrice(price)}</Text>

                
                {/* stock status and stock count */}
                <View className='flex-row items-center justify-between gap-2'>
                    <Text className={clsx(`font-normal border px-3 py-1 rounded-full font-Inter`, quantity > 0 ? 'border-green-600 text-green-600 bg-green-50' : 'border-red-600 bg-red-50 text-red-600')}>{quantity > 0 ? 'In Stock' : 'Out of Stock'}</Text>

                    <View className='flex-row gap-4'>
                        <Pressable>
                            <Feather name="edit-3" size={18} color="#757575" />
                        </Pressable>
                        <Pressable>
                            <Feather name="trash-2" size={18} color="#757575" />
                            
                        </Pressable>
                    </View>
                </View>
                
            </View>
        </View>
    )
}

export default ProductCard
