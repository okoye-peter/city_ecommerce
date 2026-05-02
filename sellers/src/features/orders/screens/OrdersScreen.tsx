import { View, Text, Platform, Pressable, FlatList } from 'react-native'
import React, { useState } from 'react'
import SafeAreaView from '@/src/components/ui/NativeStyledSafeAreaView'
import ProductCard from '@/src/features/home/components/ProductCard';
import { Link } from 'expo-router';
import { StatusType } from '@/src/utils/statusClass';
import CustomTab from '@/src/components/ui/CustomTab';

export interface OrderItem {
    id: number;
    productImageUrl: string;
    productName: string;
    orderTotal: number;
    orderRef: string;
    date: string;
    status: StatusType;
}

const OrderItems: OrderItem[] = [
    {
        id: 1,
        productImageUrl: 'https://i.pinimg.com/736x/35/8d/d4/358dd4e5c282cf122a7e35a8232c5442.jpg',
        productName: 'MUST-HAVE PANTS for GIRLS | Fashion Tips Tricks',
        orderTotal: 25400,
        orderRef: '120260981',
        date: '2024-04-20',
        status: 'pending',
    },
    {
        id: 2,
        productImageUrl: 'https://i.pinimg.com/736x/e6/e1/df/e6e1df3b6e79c669448f5cbc18c09d3e.jpg',
        productName: 'Vestidos',
        orderTotal: 6500,
        orderRef: '120260982',
        date: '2024-04-21',
        status: 'accepted',
    },
    {
        id: 3,
        productImageUrl: 'https://i.pinimg.com/736x/4b/30/b7/4b30b759500150264fe04f548672daf8.jpg',
        productName: 'Fitted curvy shown gown',
        orderTotal: 12000,
        orderRef: '120260983',
        date: '2024-04-22',
        status: 'ready_for_pickup',
    },
    {
        id: 4,
        productImageUrl: 'https://i.pinimg.com/736x/fe/30/1b/fe301b4825006d8494dafac01a4206d2.jpg',
        productName: 'Long Maxi Dress',
        orderTotal: 18000,
        orderRef: '120260984',
        date: '2024-04-23',
        status: 'picked_up',
    },
    {
        id: 5,
        productImageUrl: 'https://i.pinimg.com/1200x/6b/4c/ad/6b4cad2baf13774d38b081a7abefd624.jpg',
        productName: 'MUST-HAVE PANTS for GIRLS | Fashion Tips Tricks',
        orderTotal: 25400,
        orderRef: '120260985',
        date: '2024-04-24',
        status: 'delivered',
    },
    {
        id: 6,
        productImageUrl: 'https://i.pinimg.com/736x/a3/8b/6b/a38b6b002e08f0aecb37689bfccad853.jpg',
        productName: 'Party Wears',
        orderTotal: 35400,
        orderRef: '120260986',
        date: '2024-04-25',
        status: 'cancel',
    },
    {
        id: 7,
        productImageUrl: 'https://i.pinimg.com/736x/01/16/fa/0116faca55265b3d7b3606c21581fc42.jpg',
        productName: 'MUST-HAVE PANTS for GIRLS | Fashion Tips Tricks',
        orderTotal: 25400,
        orderRef: '120260987',
        date: '2024-04-26',
        status: 'pending',
    },
    {
        id: 8,
        productImageUrl: 'https://i.pinimg.com/736x/dc/4f/f6/dc4ff635b1f053208116653aeab1a2de.jpg',
        productName: 'MUST-HAVE PANTS for GIRLS | Fashion Tips Tricks',
        orderTotal: 25400,
        orderRef: '120260988',
        date: '2024-04-27',
        status: 'accepted',
    },
    {
        id: 9,
        productImageUrl: 'https://i.pinimg.com/736x/b2/ba/89/b2ba8904a9a572012a77f07f25017cb0.jpg',
        productName: 'MUST-HAVE PANTS for GIRLS | Fashion Tips Tricks',
        orderTotal: 25400,
        orderRef: '120260989',
        date: '2024-04-28',
        status: 'ready_for_pickup',
    },
    {
        id: 10,
        productImageUrl: 'https://i.pinimg.com/736x/ab/ab/9d/abab9d04b9ee22c07e4de02d57559c93.jpg',
        productName: 'MUST-HAVE PANTS for GIRLS | Fashion Tips Tricks',
        orderTotal: 25400,
        orderRef: '120260990',
        date: '2024-04-29',
        status: 'delivered',
    },
];


const TABS = ['All', 'Ongoing', 'Delivered', 'Declined'];

const OrdersScreen = () => {
    const [activeTab, setActiveTab] = useState(0);

    const filteredOrders = OrderItems.filter(order => {
        if (activeTab === 0) return true;
        if (activeTab === 1) return ['pending', 'accepted', 'ready_for_pickup', 'picked_up'].includes(order.status);
        if (activeTab === 2) return order.status === 'delivered';
        if (activeTab === 3) return order.status === 'cancel';
        return true;
    });

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <View className="mb-6">
                <Text className={`text-primary font-Inter-bold mt-6 px-6 ${Platform.OS === 'ios' ? 'text-3xl' : 'text-4xl'}`}>
                    Orders
                </Text>
            </View>

            <View className="px-6 pb-6 mb-4 border-b-2 border-border/30">
                <CustomTab
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    TABS={TABS}
                />
            </View>

            <FlatList
                data={filteredOrders}
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item: orderItem }) => (
                    <Link asChild href={`/(auth)/Orders/${orderItem.id}`}>
                        <Pressable android_ripple={{ foreground: true }}>
                            <ProductCard
                                className=""
                                productImageUrl={orderItem.productImageUrl}
                                productName={orderItem.productName}
                                orderTotal={orderItem.orderTotal}
                                orderRef={orderItem.orderRef}
                                date={orderItem.date}
                                status={orderItem.status}
                            />
                        </Pressable>
                    </Link>
                )}
                ListEmptyComponent={() => (
                    <View className="items-center justify-center flex-1 px-6">
                        <Text className="text-lg text-center text-muted-foreground font-Inter">
                            No {TABS[activeTab].toLowerCase()} orders yet.
                        </Text>
                    </View>
                )}

            />
        </SafeAreaView>
    )
}

export default OrdersScreen
