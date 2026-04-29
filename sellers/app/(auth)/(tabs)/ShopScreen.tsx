import { View, Text, Platform, Pressable, FlatList } from 'react-native'
import { useState } from 'react'
import SafeAreaView from '@/components/ui/common/NativeStyledSafeAreaView'
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import { formatCompactNumber } from '@/utils/priceFormatter';
import AntDesign from '@expo/vector-icons/AntDesign';
import ProductCard from '@/components/Shop/ProductCard';
import EditProductBottomSheet from '@/components/Shop/EditOrAddProductBottomSheet';
import { Link, useRouter } from 'expo-router';

const rating = 4.8;
const orderCount = 124234;

interface Product {
    id: number;
    image: string;
    name: string;
    price: number;
    quantity: number;
}

const Products: Product[] = [
    {
        id: 1,
        image: 'https://i.pinimg.com/736x/35/8d/d4/358dd4e5c282cf122a7e35a8232c5442.jpg',
        name: 'MUST-HAVE PANTS for GIRLS | Fashion Tips Tricks',
        price: 25400,
        quantity: 12,
    },
    {
        id: 2,
        image: 'https://i.pinimg.com/736x/e6/e1/df/e6e1df3b6e79c669448f5cbc18c09d3e.jpg',
        name: 'Vestidos',
        price: 6500,
        quantity: 0,
    },
    {
        id: 3,
        image: 'https://i.pinimg.com/736x/4b/30/b7/4b30b759500150264fe04f548672daf8.jpg',
        name: 'Fitted curvy shown gown',
        price: 12000,
        quantity: 8,
    },
    {
        id: 4,
        image: 'https://i.pinimg.com/736x/fe/30/1b/fe301b4825006d8494dafac01a4206d2.jpg',
        name: 'Long Maxi Dress',
        price: 18000,
        quantity: 24,
    },
    {
        id: 5,
        image: 'https://i.pinimg.com/1200x/6b/4c/ad/6b4cad2baf13774d38b081a7abefd624.jpg',
        name: 'MUST-HAVE PANTS for GIRLS | Fashion Tips Tricks',
        price: 25400,
        quantity: 3,
    },
    {
        id: 6,
        image: 'https://i.pinimg.com/736x/a3/8b/6b/a38b6b002e08f0aecb37689bfccad853.jpg',
        name: 'Party Wears',
        price: 35400,
        quantity: 0,
    },
    {
        id: 7,
        image: 'https://i.pinimg.com/736x/01/16/fa/0116faca55265b3d7b3606c21581fc42.jpg',
        name: 'MUST-HAVE PANTS for GIRLS | Fashion Tips Tricks',
        price: 25400,
        quantity: 15,
    },
    {
        id: 8,
        image: 'https://i.pinimg.com/736x/dc/4f/f6/dc4ff635b1f053208116653aeab1a2de.jpg',
        name: 'MUST-HAVE PANTS for GIRLS | Fashion Tips Tricks',
        price: 25400,
        quantity: 7,
    },
    {
        id: 9,
        image: 'https://i.pinimg.com/736x/b2/ba/89/b2ba8904a9a572012a77f07f25017cb0.jpg',
        name: 'MUST-HAVE PANTS for GIRLS | Fashion Tips Tricks',
        price: 25400,
        quantity: 2,
    },
    {
        id: 10,
        image: 'https://i.pinimg.com/736x/ab/ab/9d/abab9d04b9ee22c07e4de02d57559c93.jpg',
        name: 'MUST-HAVE PANTS for GIRLS | Fashion Tips Tricks',
        price: 25400,
        quantity: 0,
    },
    {
        id: 11,
        image: 'https://i.pinimg.com/1200x/44/82/72/4482722ce01e78c76237b29155471e2a.jpg',
        name: 'MUST-HAVE PANTS for GIRLS | Fashion Tips Tricks',
        price: 25400,
        quantity: 9,
    },
    {
        id: 12,
        image: 'https://i.pinimg.com/736x/bc/86/9a/bc869a0264602e71d5e33eb684ca9031.jpg',
        name: 'MUST-HAVE PANTS for GIRLS | Fashion Tips Tricks',
        price: 25400,
        quantity: 11,
    },
    {
        id: 13,
        image: 'https://i.pinimg.com/736x/3a/58/73/3a58732c7165ca7c61f1e03fbd614f23.jpg',
        name: 'MUST-HAVE PANTS for GIRLS | Fashion Tips Tricks',
        price: 25400,
        quantity: 4,
    },
    {
        id: 14,
        image: 'https://i.pinimg.com/736x/96/30/d8/9630d8292b260b7373ae13e6a37295be.jpg',
        name: 'MUST-HAVE PANTS for GIRLS | Fashion Tips Tricks',
        price: 25400,
        quantity: 20,
    },
    {
        id: 15,
        image: 'https://i.pinimg.com/736x/fa/96/3c/fa963c8e8c95c7d3930005fb1691bbfb.jpg',
        name: 'MUST-HAVE PANTS for GIRLS | Fashion Tips Tricks',
        price: 25400,
        quantity: 1,
    },
    {
        id: 16,
        image: 'https://i.pinimg.com/736x/84/74/ec/8474ecd7697bdf166f54bdeff1d747e5.jpg',
        name: 'MUST-HAVE PANTS for GIRLS | Fashion Tips Tricks',
        price: 25400,
        quantity: 0,
    },
    {
        id: 17,
        image: 'https://i.pinimg.com/1200x/59/a2/93/59a293e814957d8b1d4262abc2273389.jpg',
        name: 'MUST-HAVE PANTS for GIRLS | Fashion Tips Tricks',
        price: 25400,
        quantity: 1,
    },
    {
        id: 18,
        image: 'https://i.pinimg.com/1200x/36/e5/bc/36e5bc4da867ab293009a42446eaad3f.jpg',
        name: 'MUST-HAVE PANTS for GIRLS | Fashion Tips Tricks',
        price: 25400,
        quantity: 1,
    },
];



const ShopScreen = () => {
    const router = useRouter();

    const [isAddBottomSheetOpen, setIsAddBottomSheetOpen] = useState(false);

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <FlatList
                data={Products}
                ListHeaderComponent={() => (
                    <View>
                        <View className='border-b-4 border-border/60 pb-3'>
                            <View className='flex-row justify-between gap-4 items-center mb-3 px-6 '>
                                <Text className={`font-normal font-Inter text-primary flex-1 ${Platform.OS === 'ios' ? 'text-xl' : 'text-2xl'}`}>My Shop</Text>
                                <View className='flex-row gap-1 items-center'>
                                    {/* search products in shop */}
                                    <Pressable className='p-2'>
                                        <EvilIcons name="search" size={24} color="#757575" />
                                    </Pressable>
                                    {/* edit shop detail */}
                                    <Pressable className='p-2' onPress={() => router.push('/(auth)/Shops/EditStoreDetailsScreen')} >
                                        <Feather name="edit-3" size={17} color="#757575" />
                                    </Pressable>
                                </View>
                            </View>

                            <Link href="/(auth)/Shops/ViewStoreDetailsScreen" asChild>
                                <Pressable className='flex-row items-center gap-x-1.5 px-4 mb-3 w-full'>
                                    <View className='flex-row items-baseline gap-1'>
                                        <Entypo name="star" size={17} color={rating > 0 ? `#E8B931` : `#F5F5F5`} />
                                        <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} text-secondary font-normal font-Inter`}>{rating}</Text>
                                    </View>

                                    <View className='h-3.5 w-[1px] bg-border' />

                                    <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} text-secondary font-normal font-Inter`}>{formatCompactNumber(orderCount)} Orders</Text>

                                    <View className='h-3.5 w-[1px] bg-border' />

                                    {/* view shop details */}
                                    <View className={`flex-row items-center`}>
                                        <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} text-secondary font-normal font-Inter`}>Open until 5:30 pm</Text>
                                        <Feather name="chevron-right" size={17} color="#757575" />
                                    </View>
                                </Pressable>
                            </Link>

                            {/* shop categories  */}
                            <View className='flex-row gap-2 px-4'>
                                <Text className={`${Platform.OS === 'ios' ? 'text-sm' : 'text-base'} px-2 py-1 rounded-lg text-secondary bg-secondary/10 font-normal font-Inter`}>Fashion</Text>
                                <Text className={`${Platform.OS === 'ios' ? 'text-sm' : 'text-base'} px-2 py-1 rounded-lg text-secondary bg-secondary/10 font-normal font-Inter`}>Fashion</Text>
                                <Text className={`${Platform.OS === 'ios' ? 'text-sm' : 'text-base'} px-2 py-1 rounded-lg text-secondary bg-secondary/10 font-normal font-Inter`}>Fashion</Text>
                            </View>
                        </View>

                        <View className='flex-row items-center justify-between h-12 px-4 mt-2'>
                            <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} text-primary font-normal font-Inter`}>Products ({Products.length})</Text>
                            {/* add products to shop */}
                            <Pressable
                                onPress={() => setIsAddBottomSheetOpen(true)}
                                className='flex-row gap-2 items-center bg-primary px-4 py-2 rounded-full'
                            >
                                <AntDesign name="plus" size={14} color="white" />
                                <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} text-white font-normal font-Inter`}>Add</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
                renderItem={({ item }) => (
                    <View className='px-4'>
                        <ProductCard
                            image={item.image}
                            name={item.name}
                            price={item.price}
                            quantity={item.quantity}
                        />
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <View className='h-4' />}
                contentContainerStyle={{ paddingBottom: 100 }}
                className='flex-1'
            />
            {isAddBottomSheetOpen && (
                <EditProductBottomSheet
                    onClose={() => setIsAddBottomSheetOpen(false)}
                />
            )}
        </SafeAreaView>
    )
}

export default ShopScreen