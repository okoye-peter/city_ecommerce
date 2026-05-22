import { View, Text, Platform, Pressable, ScrollView } from 'react-native'
import React, { useState } from 'react'
import SafeAreaView from '@/components/ui/NativeStyledSafeAreaView';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { clsx } from 'clsx';
import { useGetStates } from '@/features/states/queries';
import { useGetMostPopularMarkets } from '@/features/markets/queries';
import { useGetPopularProducts } from '@/features/products/queries';


const ExploreScreen = () => {
    const [selectedStateId, setSelectedStateId] = useState('');
    const limit = 4;
    const {data: states} = useGetStates();
    const {data: markets, isLoading} = useGetMostPopularMarkets(selectedStateId, limit);
    const {} = useGetPopularProducts(selectedStateId, 10);
    
  return (
    <SafeAreaView className='flex-1' edges={['top', 'left', 'right']}>
      <View className='pb-2'>
        <Pressable className='flex-row items-center gap-1 px-6 py-3 border-b-[2px] border-secondary/10 '>
            <SimpleLineIcons name="location-pin" size={16} color="#1E1E1E" />
            <Text className={clsx('text-primary font-Inter', Platform.OS === 'ios' && 'text-base', Platform.OS === 'android' && 'text-lg')}>Lagos</Text>
            <Entypo name="chevron-small-down" size={20} color="black" />
        </Pressable>
        
        <ScrollView className='px-6 pt-2'>
            <Text className={clsx('text-primary font-Inter', Platform.OS === 'ios' && 'text-lg', Platform.OS === 'android' && 'text-xl')}>Markets</Text>
            
        </ScrollView>
      </View>
      
      
    </SafeAreaView>
  )
}

export default ExploreScreen