import { View, Text, useWindowDimensions } from 'react-native'
import React from 'react'
import { Market } from '@/types';
import { clsx } from 'clsx';

const MarketCard = ({market}: {market: Market}) => {
    const dimension = useWindowDimensions();
  return (
    <View>
      <View className={clsx(dimension.width <= 320 ? 'w-72' : 'w-80',  )}></View>
    </View>
  )
}

export default MarketCard