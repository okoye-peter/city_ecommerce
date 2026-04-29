import { Pressable, Text, View, ScrollView, Platform } from 'react-native'
import React from 'react'
import SafeAreaView from '@/components/ui/common/NativeStyledSafeAreaView'
import { Image } from 'expo-image'
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';

cssInterop(LinearGradient, {
    className: 'style',
});


export default function ViewStoreDetailsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
                <View className='h-[350px] overflow-hidden relative bg-gray-200'>
                    {/* back button */}
                    <Pressable
                        className='p-3 rounded-full bg-white/80 absolute top-4 left-4 z-50'
                        onPress={() => router.back()}
                    >
                        <Feather name="arrow-left" size={20} color="black" />
                    </Pressable>

                    {/* store banner */}
                    <Image
                        source="https://i.pinimg.com/1200x/fc/91/8a/fc918ad6c979aa2cea78bf3cd39abe2f.jpg"
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
                        <Text className='text-white text-2xl font-bold'>Amaka&apos;s Fabrics</Text>
                        <Text className='text-white/80 text-base'>Balogun Market</Text>
                    </View>
                </View>

                {/* Details Card */}
                <View className='bg-white -mt-8 rounded-t-[32px] pt-6 pb-10 flex-1'>
                    {/* Description Section */}
                    <View className='flex-row justify-between items-start mb-4 px-5'>
                        <Text className={`text-primary font-normal ${Platform.OS === 'ios' ? 'text-xl' : 'text-2xl'}`}>Description</Text>
                        <Pressable 
                            className='p-1'
                            onPress={() => router.push('/(auth)/Shops/EditStoreDetailsScreen')}
                        >
                            <Feather name="edit-3" size={22} color="#757575" />
                        </Pressable>
                    </View>
                    <Text className={`text-secondary ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} leading-6 mb-4 px-5`}>
                        Premium Ankara, lace, and ready-to-wear. Direct from the best fabric merchants in Balogun Market.
                    </Text>

                    {/* Stats Section */}
                    <View className='flex-row items-center mb-6 px-5'>
                        <Ionicons name="star" size={17} color="#E8B931" />
                        <Text className={`text-secondary ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} ml-1.5`}>
                            4.5 <Text className='text-secondary'>|</Text> 156 Orders <Text className='text-muted-foreground'>|</Text> Open until 5:30 pm
                        </Text>
                    </View>

                    {/* Tags Section */}
                    <View className='flex-row flex-wrap gap-2 px-5 border-b-4 border-border/30 pb-4'>
                        {['Fabrics', 'Fashion', 'Accessories'].map((tag) => (
                            <View key={tag} className='bg-light px-2 py-1.5 rounded-lg'>
                                <Text className='text-secondary text-sm font-normal'>{tag}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Share Section */}
                    <View className='border-b-4  border-border/30 py-6 px-5 flex-row justify-between items-center'>
                        <View className='flex-row items-center'>
                            <Ionicons name="globe-outline" size={20} color="#64748B" />
                            <Text className={`text-primary ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} leading-6 font-normal ml-3`}>Share with your friends</Text>
                        </View>
                        <Pressable>
                            <Ionicons name="share-social-outline" size={20} color="#64748B" />
                        </Pressable>
                    </View>

                    {/* Opening Hours Section */}
                    <View className='mt-6 px-5'>
                        <Text className={`text-primary ${Platform.OS === 'ios' ? 'text-xl' : 'text-2xl'} font-normal mb-2`}>Opening hours</Text>
                        <Text className={`text-secondary ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} leading-6`}>
                            Monday - Sunday <Text className='text-muted-foreground'>|</Text> 9:00 am - 5:30 pm
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}