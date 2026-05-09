import { Pressable, Text, View, ScrollView, Platform } from 'react-native'
import React from 'react'
import SafeAreaView from '@/src/components/ui/NativeStyledSafeAreaView'
import { Image } from 'expo-image'
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';
import { useGetUserStoreSummary } from '../../shop/queries';
import Skeleton from '@/src/components/ui/Skeleton';

cssInterop(LinearGradient, {
    className: 'style',
});

const DAY_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const DAY_NAMES: Record<string, string> = {
    MONDAY: 'Monday', TUESDAY: 'Tuesday', WEDNESDAY: 'Wednesday',
    THURSDAY: 'Thursday', FRIDAY: 'Friday', SATURDAY: 'Saturday', SUNDAY: 'Sunday',
};

function formatTime(time: string | null | undefined): string {
    if (!time) return '';
    const [h, m] = time.split(':').map(Number);
    const period = h >= 12 ? 'pm' : 'am';
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

function formatOpenDays(days: string[]): string {
    if (!days || days.length === 0) return 'Closed';
    if (days.length === 7) return 'Monday - Sunday';
    const sorted = [...days].sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b));
    if (sorted.length === 1) return DAY_NAMES[sorted[0]];
    return `${DAY_NAMES[sorted[0]]} - ${DAY_NAMES[sorted[sorted.length - 1]]}`;
}

export default function ViewStoreDetailsScreen() {
    const router = useRouter();

    const { data: store, isLoading } = useGetUserStoreSummary();

    const storeDetails = store?.store;
    const orderCount = store?.orderCount;

    if (isLoading) {
        return (
            <SafeAreaView className='flex-1 bg-white'>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Skeleton width="100%" height={350} borderRadius={0} />
                    <View className='bg-white -mt-8 rounded-t-[32px] pt-6 pb-10'>
                        <View className='px-6 mb-4'>
                            <Skeleton width={120} height={24} borderRadius={6} />
                        </View>
                        <View className='gap-2 px-6 mb-6'>
                            <Skeleton width="100%" height={16} borderRadius={4} />
                            <Skeleton width="90%" height={16} borderRadius={4} />
                            <Skeleton width="65%" height={16} borderRadius={4} />
                        </View>
                        <View className='px-6 mb-6'>
                            <Skeleton width={200} height={18} borderRadius={4} />
                        </View>
                        <View className='flex-row gap-2 px-6 pb-4 mb-2'>
                            <Skeleton width={80} height={32} borderRadius={8} />
                            <Skeleton width={80} height={32} borderRadius={8} />
                            <Skeleton width={80} height={32} borderRadius={8} />
                        </View>
                        <View className='px-6 py-6'>
                            <Skeleton width={180} height={18} borderRadius={4} />
                        </View>
                        <View className='gap-2 px-6 mt-2'>
                            <Skeleton width={140} height={24} borderRadius={6} />
                            <Skeleton width={220} height={16} borderRadius={4} />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
                <View className='h-[350px] overflow-hidden relative bg-gray-200'>
                    {/* back button */}
                    <Pressable
                        className='absolute z-50 p-3 rounded-full bg-white/80 top-4 left-4'
                        onPress={() => router.back()}
                    >
                        <Feather name="arrow-left" size={20} color="black" />
                    </Pressable>

                    {/* store banner */}
                    <Image
                        source={{
                            uri: storeDetails?.imageUrl ?? undefined
                        }}
                        style={{ width: '100%', height: 350, backgroundColor: '#E5E7EB' }}
                        contentFit='cover'
                        transition={500}
                    />

                    {/* gradient overlay */}
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        className='absolute bottom-0 left-0 right-0 h-1/2'
                    />

                    {/* store name and location over image */}
                    <View className='absolute bottom-12 left-6 right-6'>
                        <Text className='text-2xl font-bold text-white'>{storeDetails?.name}</Text>
                        {storeDetails?.market?.name && (
                            <Text className='text-base text-white/80'>{storeDetails.market.name}</Text>
                        )}
                    </View>
                </View>

                {/* Details Card */}
                <View className='bg-white -mt-8 rounded-t-[32px] pt-6 pb-10 flex-1'>
                    {/* Description Section */}
                    <View className='flex-row items-center justify-between px-6 mb-3'>
                        <Text className={`text-primary font-normal ${Platform.OS === 'ios' ? 'text-xl' : 'text-2xl'}`}>About</Text>
                        <Pressable
                            className='p-1'
                            onPress={() => router.push('/(auth)/Shops/EditStoreDetailsScreen')}
                        >
                            <Feather name="edit-3" size={18} color="#757575" />
                        </Pressable>
                    </View>
                    <Text className={`text-secondary ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} leading-6 mb-4 px-6`}>
                        {storeDetails?.description ?? '—'}
                    </Text>

                    {/* Stats Section */}
                    <View className='flex-row items-center px-6 mb-6'>
                        <Ionicons name="star" size={17} color="#E8B931" />
                        <Text className={`text-secondary ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} ml-1.5`}>
                            {orderCount ?? 0} Orders
                            {storeDetails?.closingTime ? (
                                <Text> <Text className='text-muted-foreground'>|</Text> Open until {formatTime(storeDetails.closingTime)}</Text>
                            ) : null}
                        </Text>
                    </View>

                    {/* Categories Section */}
                    {storeDetails?.categories && storeDetails.categories.length > 0 && (
                        <View className='flex-row flex-wrap gap-2 px-6 pb-4 border-b-4 border-border/30'>
                            {storeDetails.categories.map((c) => (
                                <View key={c.id} className='bg-light px-2 py-1.5 rounded-lg'>
                                    <Text className='text-sm font-normal text-secondary'>{c.category.name}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Share Section */}
                    <View className='flex-row items-center justify-between px-6 py-6 border-b-4 border-border/30'>
                        <View className='flex-row items-center'>
                            <Ionicons name="globe-outline" size={20} color="#64748B" />
                            <Text className={`text-primary ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} leading-6 font-normal ml-3`}>Share with your friends</Text>
                        </View>
                        <Pressable>
                            <Ionicons name="share-social-outline" size={20} color="#64748B" />
                        </Pressable>
                    </View>

                    {/* Opening Hours Section */}
                    <View className='px-6 mt-6'>
                        <Text className={`text-primary ${Platform.OS === 'ios' ? 'text-xl' : 'text-2xl'} font-normal mb-2`}>Opening hours</Text>
                        <Text className={`text-secondary ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} leading-6`}>
                            {storeDetails?.openDays ? formatOpenDays(storeDetails.openDays) : '—'}
                            {storeDetails?.openingTime && storeDetails?.closingTime ? (
                                <Text> <Text className='text-muted-foreground'>|</Text> {formatTime(storeDetails.openingTime)} - {formatTime(storeDetails.closingTime)}</Text>
                            ) : null}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
