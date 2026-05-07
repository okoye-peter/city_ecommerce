import { View, Text, Platform, Pressable } from 'react-native'
import React from 'react'
import EarningCard from './EarningCard'
import ProductCard from './ProductCard'
import { useRouter } from 'expo-router'



const Online = () => {
    const router = useRouter()
    const viewOrder = (orderId: number) => {
        router.push(`/(auth)/Orders/${orderId}`)
    }

    return (
        <View className=''>
            <View className='py-4 border-b-4 border-muted-neutral/60 px-6'>
                <EarningCard amount={111.13} total={69} />
            </View>
            <View className='py-3 px-6'>
                <Text className={`${Platform.OS === 'ios' ? 'text-lg' : 'text-xl'} font-normal text-body mb-2`}>Active Orders</Text>

                <View>
                    <Pressable onPress={() => viewOrder(111)} android_ripple={{ foreground: true }}>
                        <ProductCard
                            className="border-b border-border/60"
                            productImageUrl='https://i.pinimg.com/1200x/23/f2/0f/23f20fe7d8c365a2595a832c12295d99.jpg'
                            productName='Shoes'
                            orderTotal={111.13}
                            orderRef='120260989'
                            date='2022-01-01'
                            status='accepted'
                        />
                    </Pressable>

                    <Pressable onPress={() => viewOrder(111)} android_ripple={{ foreground: true }}>
                        <ProductCard
                            className="border-b border-border/60"
                            productImageUrl='https://i.pinimg.com/1200x/23/f2/0f/23f20fe7d8c365a2595a832c12295d99.jpg'
                            productName='Shoes'
                            orderTotal={111.13}
                            orderRef='120260989'
                            date='2022-01-01'
                            status='ready_for_pickup'
                        />
                    </Pressable>

                    <Pressable onPress={() => viewOrder(111)} android_ripple={{ foreground: true }}>
                        <ProductCard
                            className=""
                            productImageUrl='https://i.pinimg.com/1200x/23/f2/0f/23f20fe7d8c365a2595a832c12295d99.jpg'
                            productName='Shoes'
                            orderTotal={111.13}
                            orderRef='120260989'
                            date='2022-01-01'
                            status='pending'
                        />
                    </Pressable>
                </View>
            </View>
        </View>
    )
}


export default Online
