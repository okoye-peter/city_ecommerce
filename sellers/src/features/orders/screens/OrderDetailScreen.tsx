import { Platform, Pressable, ScrollView, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SafeAreaView from '@/src/components/ui/NativeStyledSafeAreaView';
import StatusCard from '@/src/components/ui/StatusCard';
import OrderStatusTracker from '@/src/components/ui/OrderStatusTracker';
import ProductCard from '@/src/features/orders/components/ProductCard';
import CustomButton from '@/src/components/ui/CustomButton';
import { formatPrice } from '@/src/utils/priceFormatter';


const OrderDetailScreen = () => {
    const { id } = useLocalSearchParams()
    const router = useRouter()
    console.log(id)

  return (
    <SafeAreaView className='flex-1 pb-3'>
        <ScrollView className='flex-1 pt-3 bg-white' showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className='px-6 pb-2 border-b-4 border-border/50'>
                <View className=''>
                    <View className='flex-row items-center gap-2 mb-3'>
                        <Pressable onPress={() => router.back()} className='border border-border bg-muted-neutral p-2.5 rounded-full'>
                            <MaterialCommunityIcons name="arrow-left" size={20} color="text-primary" />
                        </Pressable>
                        <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal text-primary-light font-Inter`}>ORD-2026-0898</Text>
                    </View>
                    <View className='flex-row items-center gap-x-1.5'>
                        <StatusCard status="accepted" />
                        <View className='border-l pl-1.5 border-border'>
                            <Text className={`${Platform.OS === 'ios' ? 'text-sm' : 'text-base'} font-normal text-secondary font-Inter`}>12 Jan, 2022</Text>
                        </View>
                        <View className='border-l pl-1.5 border-border'>
                            <Text className={`${Platform.OS === 'ios' ? 'text-sm' : 'text-base'} font-normal text-secondary font-Inter`}>12:00 PM</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Status Tracker */}
            <View className='px-6 py-4 border-b-4 border-border/50'>
               <OrderStatusTracker currentStatus='accepted' />
            </View>

            {/* Order Items */}
            <View className='px-6 py-3'>
                <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal text-primary font-Inter`}>Order Items</Text>
                <View className=''>
                    {[...Array(6)].map((_, i) => (
                        <View key={i} className={`py-4 ${i < 5 ? 'border-b border-border/50' : ''}`}>
                            <ProductCard />
                        </View>
                    ))}
                </View>
            </View>

            {/* Summary total */}
            <View className='flex flex-row items-center justify-between px-4 py-2'>
               <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal text-primary font-Inter`}>Total</Text>
               <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal text-primary font-Inter`}>{formatPrice(23900)}</Text>
            </View>

            <View className='px-4 py-2 mt-2'>
                <CustomButton
                    buttonText='Marked as Picked Up'
                    onPressHandler={() => {}}
                />
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default OrderDetailScreen
