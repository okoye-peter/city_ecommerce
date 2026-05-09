import { View, Text, Platform, Pressable, FlatList, TextInput, ActivityIndicator } from 'react-native'
import Skeleton from '@/src/components/ui/Skeleton'
import { useCallback, useEffect, useState } from 'react'
import SafeAreaView from '@/src/components/ui/NativeStyledSafeAreaView'
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import { formatCompactNumber } from '@/src/utils/priceFormatter';
import AntDesign from '@expo/vector-icons/AntDesign';
import ProductCard from '@/src/features/shop/components/ProductCard';
import { Link, useRouter } from 'expo-router';
import { selectStore, useAuthStore } from '../../auth/store/authStore';
import { useGetProducts, useGetUserStoreSummary } from '../queries';
import { format } from 'date-fns';
import { Product } from '@/src/types';


const rating = 4.8;

const ItemSeparator = () => <View className='h-4' />;

const ShopScreen = () => {
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const store = useAuthStore(selectStore);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const { data: storeData } = useGetUserStoreSummary()

    const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetProducts({
        search: debouncedSearch || undefined,
        storeId: store?.id?.toString(),
    });

    const products = data?.pages.flatMap((page) => page.data) ?? [];
    const total = data?.pages[0]?.meta.total ?? 0;

    const onEndReached = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <SafeAreaView edges={['top', 'left', 'right']} className='flex-1 bg-white'>

            {/* Fixed header — lives outside FlatList so typing never remounts it */}
            <View className='px-6 py-2 pb-3 border-b-4 border-border/60'>
                <View className='flex-row items-center justify-between gap-4 mb-3'>
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
                                    height: Platform.OS === 'ios' ? 40 : 'auto',
                                }}
                            />
                            {searchQuery.length > 0 && (
                                <Pressable onPress={() => setSearchQuery('')} className='mr-1.5'>
                                    <EvilIcons name="close" size={18} color="#A9A9A9" />
                                </Pressable>
                            )}
                        </View>
                    ) : (
                        <Text numberOfLines={1} className={`font-normal font-Inter text-primary flex-1 ${Platform.OS === 'ios' ? 'text-xl' : 'text-2xl'}`}>{store?.name}</Text>
                    )}

                    <View className='flex-row items-center gap-1'>
                        {isSearching ? (
                            <Pressable className='p-2' onPress={() => { setIsSearching(false); setSearchQuery(''); }}>
                                <Text className='text-base text-secondary font-Inter'>Cancel</Text>
                            </Pressable>
                        ) : (
                            <>
                                <Pressable className='p-2' onPress={() => setIsSearching(true)}>
                                    <EvilIcons name="search" size={24} color="#757575" />
                                </Pressable>
                                <Pressable className='p-2' onPress={() => router.push('/(auth)/Shops/EditStoreDetailsScreen')}>
                                    <Feather name="edit-3" size={17} color="#757575" />
                                </Pressable>
                            </>
                        )}
                    </View>
                </View>

                <Link href="/(auth)/Shops/ViewStoreDetailsScreen" asChild>
                    <Pressable className='flex-row items-center gap-x-1.5 mb-3 w-full'>
                        <View className='flex-row items-baseline gap-1'>
                            <Entypo name="star" size={17} color={rating > 0 ? '#E8B931' : '#F5F5F5'} />
                            <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} text-secondary font-normal font-Inter`}>{rating}</Text>
                        </View>

                        <View className='h-3.5 w-[1px] bg-border' />

                        <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} text-secondary font-normal font-Inter`}>{formatCompactNumber(storeData?.orderCount ?? 0)} Orders</Text>

                        <View className='h-3.5 w-[1px] bg-border' />

                        <View className='flex-row items-center'>
                            <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} text-secondary font-normal font-Inter`}>
                                {storeData?.store?.closingTime
                                    ? `Open until ${format(new Date(`1970-01-01T${storeData?.store.closingTime}`), 'p')}`
                                    : 'Closing time unavailable'}
                            </Text>
                            <Feather name="chevron-right" size={17} color="#757575" />
                        </View>
                    </Pressable>
                </Link>

                <View className='flex-row items-center gap-2'>
                    {
                        (storeData?.store.categories?.slice(0, 2) ?? []).map(({ id, category }) =>
                            (<Text key={`store_cat_${id}`} className={`${Platform.OS === 'ios' ? 'text-sm' : 'text-base'} px-2 py-1 rounded-lg text-secondary bg-secondary/10 font-normal font-Inter`}>{category.name}</Text>)
                        )
                    }
                    {(storeData?.store?.categories?.length ?? 0) > 2 && <Text className={`text-secondary ${Platform.OS === 'ios' ? 'text-xs' : 'text-sm'}`}>+{(storeData?.store?.categories?.length ?? 0) - 2} more</Text>}
                </View>
            </View>

            <FlatList
                data={products}
                ListHeaderComponent={() => (
                    <View className='flex-row items-center justify-between h-12 px-6 mt-2'>
                        <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} text-primary font-normal font-Inter`}>
                            {isLoading ? 'Products' : `Products (${total})`}
                        </Text>
                        <Pressable
                            onPress={() => router.push('/(auth)/Shop/AddOrEditProductScreen')}
                            className='flex-row items-center gap-2 px-4 py-2 rounded-full bg-primary'
                        >
                            <AntDesign name="plus" size={14} color="white" />
                            <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} text-white font-normal font-Inter`}>Add</Text>
                        </Pressable>
                    </View>
                )}
                renderItem={({ item }: {item: Product}) => (
                    <View className='px-6'>
                        <ProductCard
                            product={item}
                        />
                    </View>
                )}
                ListEmptyComponent={() =>
                    isLoading ? (
                        <View className='px-6'>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <View key={i} className='flex-row items-center gap-4 py-4 border-b border-border/60'>
                                    <Skeleton width={88} height={88} borderRadius={16} />
                                    <View className='flex-1 gap-2'>
                                        <Skeleton width="70%" height={20} />
                                        <Skeleton width="40%" height={20} />
                                        <View className='flex-row items-center justify-between mt-1'>
                                            <Skeleton width={80} height={28} borderRadius={20} />
                                            <View className='flex-row gap-4'>
                                                <Skeleton width={18} height={18} borderRadius={4} />
                                                <Skeleton width={18} height={18} borderRadius={4} />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View className='items-center justify-center px-6 py-16'>
                            <Feather name="box" size={40} color="#9CA3AF" />
                            <Text className='mt-3 text-base text-center text-secondary font-Inter'>
                                {debouncedSearch ? 'No products match your search.' : 'No products yet. Tap Add to create one.'}
                            </Text>
                        </View>
                    )
                }
                ListFooterComponent={() =>
                    isFetchingNextPage ? (
                        <View className='items-center py-4'>
                            <ActivityIndicator size="small" color="#9CA3AF" />
                        </View>
                    ) : null
                }
                onEndReached={onEndReached}
                onEndReachedThreshold={0.4}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={ItemSeparator}
                contentContainerStyle={{ paddingBottom: 100 }}
                className='flex-1'
            />

        </SafeAreaView>
    )
}

export default ShopScreen
