import { View, Text, Platform, Pressable } from 'react-native'
import Feather from '@expo/vector-icons/Feather';
import React from 'react'
import EarningCard from './EarningCard'
import ProductCard from './ProductCard'
import { clsx } from 'clsx';
import { useGetHomeStats } from '../queries';
import Link from 'expo-router/link';
import { StatusType } from '@/src/utils/statusClass'
import Skeleton from '@/src/components/ui/Skeleton'



const Online = () => {
    const { data, isLoading } = useGetHomeStats();

    if (isLoading) {
        return (
            <View className=''>
                <View className='px-6 py-4 border-b-4 border-muted-neutral/60'>
                    <Skeleton width="100%" height={160} borderRadius={12} />
                </View>
                <View className='flex-1 px-6 py-3'>
                    <Skeleton width={120} height={24} style={{ marginBottom: 12 }} />
                    {[1, 2, 3].map((i) => (
                        <View key={i} className='flex-row items-center gap-2 py-4 border-b border-border/60'>
                            <Skeleton width={88} height={88} borderRadius={8} />
                            <View className='flex-1 gap-2'>
                                <Skeleton width="60%" height={24} />
                                <Skeleton width="40%" height={16} />
                                <View className='flex-row items-center justify-between mt-1'>
                                    <Skeleton width={80} height={24} />
                                    <Skeleton width={100} height={32} borderRadius={16} />
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        );
    }

    return (
        <View className=''>
            <View className='px-6 py-4 border-b-4 border-muted-neutral/60'>
                <EarningCard 
                    amount={data?.data?.totalOrderAmount ?? 0} 
                    total={data?.data?.totalOrderCount ?? 0} 
                    percentage={data?.data?.percentage ?? 0}
                />
            </View>
            <View className='flex-1 px-6 py-3'>
                <Text className={`${Platform.OS === 'ios' ? 'text-lg' : 'text-xl'} font-normal text-body mb-2`}>Active Orders</Text>

                <View>
                    {
                        (data?.data?.activeOrders ?? []).map((orderGroup) => (
                            <Link href={`/(auth)/Orders/${orderGroup.id}`} key={`activeOrderGroup_${orderGroup.id}`} >
                                <ProductCard
                                    className="border-b border-border/60"
                                    productImageUrl={orderGroup.orders?.[0]?.product?.imageUrl ?? '/assets/images/product_package_default.jpeg'}
                                    productName={orderGroup.orders?.[0]?.product?.name ?? 'Product Deleted'}
                                    orderTotal={orderGroup.totalAmount}
                                    orderRef={orderGroup.refNo}
                                    date={orderGroup.createdAt.toString()}
                                    status={orderGroup.status.toLowerCase() as StatusType}
                                    />
                            </Link>
                        ))
                    }
                    {
                        (data?.data?.activeOrders ?? []).length === 0 && (
                            <View className="items-center justify-center py-10">
                                <View className="items-center justify-center w-20 h-20 mb-4 rounded-full bg-muted-neutral/10">
                                    <Feather name="shopping-bag" size={40} color="#9CA3AF" />
                                </View>
                                <Text className="text-lg font-medium text-body">No Active Orders</Text>
                                <Text className="px-10 mt-1 text-sm text-center text-secondary">
                                    You don&apos;t have any active orders at the moment. New orders will appear here.
                                </Text>
                            </View>
                        )
                    }

                    {
                        (data?.data?.activeOrders?.length ?? 0) > 0 && !isLoading && (
                        <View className="items-center justify-center mt-2">
                            <Pressable className="border-primary px-4 py-1.5 rounded-full">
                                <Text className={`font-normal text-secondary ${clsx(Platform.OS === 'ios' && 'text-sm', Platform.OS === 'android' && 'text-base')}`}>View more</Text>
                            </Pressable>
                        </View>
                        )
                    }
                </View>
            </View>
        </View>
    )
}


export default Online
