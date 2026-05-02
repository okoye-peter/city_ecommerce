import { View, Text, Platform, Pressable, FlatList, TextInput } from 'react-native'
import { useState } from 'react'
import SafeAreaView from '@/src/components/ui/NativeStyledSafeAreaView'
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import { formatCompactNumber } from '@/src/utils/priceFormatter';
import AntDesign from '@expo/vector-icons/AntDesign';
import ProductCard from '@/src/features/shop/components/ProductCard';
import EditProductBottomSheet from '@/src/features/shop/components/EditOrAddProductBottomSheet';
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
];


const ShopScreen = () => {
    const router = useRouter();

    const [isAddBottomSheetOpen, setIsAddBottomSheetOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const filteredProducts = Products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <FlatList
                data={filteredProducts}
                ListHeaderComponent={() => (
                    <View className=''>
                        <View className='px-6 py-2 pb-3 border-b-4 border-border/60'>
                            <View className='flex-row items-center justify-between gap-4 mb-3 '>
                                {isSearching ? (
                                    <View className='flex-row items-center flex-1 h-10 bg-gray-100 rounded-full'>
                                        <View style={{ marginTop: Platform.OS === 'ios' ? 2 : 0 }} className='ml-1.5'>
                                            <Feather name="search" size={18} color="#757575" />
                                        </View>
                                        <TextInput
                                            autoFocus
                                            className={`flex-1 p-0 ml-2 ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'} font-Inter text-primary`}
                                            placeholder='Search products...'
                                            value={searchQuery}
                                            onChangeText={setSearchQuery}
                                            style={{
                                                includeFontPadding: false,
                                                textAlignVertical: 'center',
                                                height: Platform.OS === 'ios' ? 40 : 'auto'
                                            }}
                                        />
                                        {searchQuery.length > 0 && (
                                            <Pressable onPress={() => setSearchQuery('')} className='mr-1.5'>
                                                <EvilIcons name="close" size={18} color="#A9A9A9" />
                                            </Pressable>
                                        )}
                                    </View>
                                ) : (
                                    <Text className={`font-normal font-Inter text-primary flex-1 ${Platform.OS === 'ios' ? 'text-xl' : 'text-2xl'}`}>My Shop</Text>
                                )}

                                <View className='flex-row items-center gap-1'>
                                    {isSearching ? (
                                        <Pressable className='p-2' onPress={() => {
                                            setIsSearching(false);
                                            setSearchQuery('');
                                        }}>
                                            <Text className='text-base text-secondary font-Inter'>Cancel</Text>
                                        </Pressable>
                                    ) : (
                                        <>
                                            <Pressable className='p-2' onPress={() => setIsSearching(true)}>
                                                <EvilIcons name="search" size={24} color="#757575" />
                                            </Pressable>
                                            <Pressable className='p-2' onPress={() => router.push('/(auth)/Shops/EditStoreDetailsScreen')} >
                                                <Feather name="edit-3" size={17} color="#757575" />
                                            </Pressable>
                                        </>
                                    )}
                                </View>
                            </View>

                            <Link href="/(auth)/Shops/ViewStoreDetailsScreen" asChild>
                                <Pressable className='flex-row items-center gap-x-1.5 mb-3 w-full'>
                                    <View className='flex-row items-baseline gap-1'>
                                        <Entypo name="star" size={17} color={rating > 0 ? `#E8B931` : `#F5F5F5`} />
                                        <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} text-secondary font-normal font-Inter`}>{rating}</Text>
                                    </View>

                                    <View className='h-3.5 w-[1px] bg-border' />

                                    <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} text-secondary font-normal font-Inter`}>{formatCompactNumber(orderCount)} Orders</Text>

                                    <View className='h-3.5 w-[1px] bg-border' />

                                    <View className={`flex-row items-center`}>
                                        <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} text-secondary font-normal font-Inter`}>Open until 5:30 pm</Text>
                                        <Feather name="chevron-right" size={17} color="#757575" />
                                    </View>
                                </Pressable>
                            </Link>

                            <View className='flex-row gap-2'>
                                <Text className={`${Platform.OS === 'ios' ? 'text-sm' : 'text-base'} px-2 py-1 rounded-lg text-secondary bg-secondary/10 font-normal font-Inter`}>Fashion</Text>
                                <Text className={`${Platform.OS === 'ios' ? 'text-sm' : 'text-base'} px-2 py-1 rounded-lg text-secondary bg-secondary/10 font-normal font-Inter`}>Fashion</Text>
                                <Text className={`${Platform.OS === 'ios' ? 'text-sm' : 'text-base'} px-2 py-1 rounded-lg text-secondary bg-secondary/10 font-normal font-Inter`}>Fashion</Text>
                            </View>
                        </View>

                        <View className='flex-row items-center justify-between h-12 px-6 mt-2 '>
                            <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} text-primary font-normal font-Inter`}>
                                {searchQuery ? `Results (${filteredProducts.length})` : `Products (${Products.length})`}
                            </Text>
                            <Pressable
                                onPress={() => setIsAddBottomSheetOpen(true)}
                                className='flex-row items-center gap-2 px-4 py-2 rounded-full bg-primary'
                            >
                                <AntDesign name="plus" size={14} color="white" />
                                <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} text-white font-normal font-Inter`}>Add</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
                renderItem={({ item }) => (
                    <View className='px-6'>
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
