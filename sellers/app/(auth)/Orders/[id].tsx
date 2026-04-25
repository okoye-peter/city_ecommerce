import { Platform, Pressable, ScrollView, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SafeAreaView from '@/components/ui/common/NativeStyledSafeAreaView';
import StatusCard from '@/components/ui/common/StatusCard';
import OrderStatusTracker from '@/components/ui/common/OrderStatusTracker';
import ProductCard from '@/components/Orders/ProductCard';


const ViewOrderDetails = () => {
    const { id } = useLocalSearchParams()
    const router = useRouter()
    console.log(id)

  return (
    <SafeAreaView className='flex-1'>

        <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className='px-4 pb-2 border-b-4 border-border/50'>
                <View className=''>
                    <View className='flex-row items-center gap-2 mb-3'>
                        <Pressable onPress={() => router.back()} className='border border-border bg-muted-neutral p-2.5 rounded-full'>
                            <MaterialCommunityIcons name="arrow-left" size={20} color="text-primary" />
                        </Pressable>
                        <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal text-primary-light font-Inter`}>ORD-2026-0898</Text>
                    </View>
                    <View className='flex-row items-center gap-x-1.5'>
                        <StatusCard status="accepted" />
                        {/* date */}
                        <View className='border-l pl-1.5 border-border'>
                            <Text className={`${Platform.OS === 'ios' ? 'text-sm' : 'text-base'} font-normal text-secondary font-Inter`}>12 Jan, 2022</Text>
                        </View>
                        {/* time */}
                        <View className='border-l pl-1.5 border-border'>
                            <Text className={`${Platform.OS === 'ios' ? 'text-sm' : 'text-base'} font-normal text-secondary font-Inter`}>12:00 PM</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Status Tracker */}
            <View className='p-4 border-b-4 border-border/50'>
               <OrderStatusTracker currentStatus='accepted' />
            </View>

            {/* Order Items */}
            <View className='px-4 py-3'>
                <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal text-primary font-Inter`}>Order Items</Text>
                <View className=''>
                    <View className='py-4 border-b border-border/50'>
                        <ProductCard />
                    </View>
                    <View className='py-4 border-b border-border/50'>
                        <ProductCard />
                    </View>
                    <View className='py-4 border-b border-border/50'>
                        <ProductCard />
                    </View>
                    <View className='py-4 border-b border-border/50'>
                        <ProductCard />
                    </View>
                    <View className='py-4 border-b border-border/50'>
                        <ProductCard />
                    </View>
                    <View className='py-4'>
                        <ProductCard />
                    </View>
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default ViewOrderDetails