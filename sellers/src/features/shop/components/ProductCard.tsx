import { View, Text, Platform, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Image } from 'expo-image'
import { formatPrice } from '@/src/utils/priceFormatter'
import { clsx } from 'clsx';
import Feather from '@expo/vector-icons/Feather';
import Skeleton from '@/src/components/ui/Skeleton';
import AppModal from '@/src/components/ui/AppModal';
import CustomButton from '@/src/components/ui/CustomButton';
import { Product } from '@/src/types';
import { useDeleteProduct } from '../queries';
import LoadingOverlay from '@/src/components/ui/LoadingOverlay';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';

interface ProductCardProps {
    product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
    const router = useRouter()
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [showDeleteProductWarningModal, setShowDeleteProductWarningModal] = useState(false);

    const { mutateAsync: deleteProductAsync, isPending } = useDeleteProduct()

    const handleDelete = async () => {
        setShowDeleteProductWarningModal(false)
        try {
            if (product?.id) {
                await deleteProductAsync(product.id)
                Toast.show({
                    type: 'success',
                    text1: 'Product deleted successfully',
                    text2: `${product.name} has been deleted successfully`
                })
            }
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: 'sorry something went wrong',
                text2: err instanceof Error ? err.message : 'An error occurred'
            })
        }
    }

    return (
        <>
            <LoadingOverlay isVisible={isPending} />
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
                        source={{ uri: product.imageUrl! }}
                        style={{ width: '100%', height: '100%' }}
                        onLoadStart={() => setIsImageLoading(true)}
                        onLoad={() => setIsImageLoading(false)}
                        transition={300}
                        contentFit='cover'
                    />
                </View>
                <View className='flex-1'>
                    <Text numberOfLines={1} className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal font-Inter text-primary mb-1.5`}>{product.name}</Text>
                    <Text numberOfLines={1} className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal font-Inter text-primary mb-1.5`}>{formatPrice(product.price)}</Text>

                    <View className='flex-row items-center justify-between gap-2'>
                        <Text className={clsx(`font-normal border px-3 py-1 rounded-full font-Inter`, product.isAvailable ? 'border-green-600 text-green-600 bg-green-50' : 'border-red-600 bg-red-50 text-red-600')}>
                            {product.isAvailable ? 'In Stock' : 'Out of Stock'}
                        </Text>
                        <View className='flex-row gap-4'>
                            <Pressable onPress={() => router.push({
                                pathname: '/(auth)/Shop/AddOrEditProductScreen',
                                params: { product: JSON.stringify(product) }
                            })}>
                                <Feather name="edit-3" size={18} color="#757575" />
                            </Pressable>
                            <Pressable onPress={() => setShowDeleteProductWarningModal(true)}>
                                <Feather name="trash-2" size={18} color="#757575" />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>

            <AppModal
                isVisible={showDeleteProductWarningModal}
                title='Delete Product'
                onClose={() => setShowDeleteProductWarningModal(false)}
            >
                <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal font-Inter text-primary mb-4`}>
                    <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-semibold text-primary`}>&quot;{product.name}&quot;</Text> will be permanently removed. This action cannot be undone.
                </Text>
                <CustomButton
                    buttonText="Yes, Delete"
                    onPressHandler={handleDelete}
                    classStyle='!bg-red-600 mb-2'
                />
                <CustomButton
                    buttonText="Cancel"
                    onPressHandler={() => setShowDeleteProductWarningModal(false)}
                    classStyle='!bg-reject'
                    textClassStyle='!text-primary'
                />
            </AppModal>
        </>
    )
}

export default ProductCard
