import { View, Text, Platform, StyleSheet } from 'react-native'
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { formatCompactNumber, formatPrice } from '@/src/utils/priceFormatter';
import Feather from '@expo/vector-icons/Feather';


const EarningCard = ({ amount, total, percentage }: { amount: number, total: number, percentage: number }) => {
  return (
    <View className='w-full px-4 py-5 bg-light rounded-xl' style={styles.cardContainer}>
        <View className='flex-row justify-between mb-6'>
            <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal text-black-light leading-6`}>Today&apos;s Earnings</Text>
            <MaterialIcons name="arrow-forward-ios" size={14} color="text-black-light" />
        </View>

        <View className='flex-row justify-between mb-3'>
            <Text className={`${Platform.OS === 'ios' ? 'text-2xl' : 'text-3xl'} font-medium text-black-light leading-6`}>{formatPrice(amount)}</Text>
            <View className='flex-row items-center gap-2'>
                {percentage !== 0 && (
                    <Feather 
                        name={percentage > 0 ? "trending-up" : "trending-down"} 
                        size={20} 
                        color={percentage > 0 ? "green" : "red"} 
                    />
                )}
                <Text className={`${Platform.OS === 'ios' ? 'text-sm' : 'text-base'} font-normal ${percentage > 0 ? 'text-green-600' : percentage < 0 ? 'text-red-600' : 'text-primary'}`}>
                    {Math.abs(percentage)}% from yesterday
                </Text>
            </View>
        </View>
        <Text className={`${Platform.OS === 'ios' ? 'text-sm' : 'text-base'} font-normal text-secondary`}>{formatCompactNumber(total)} Total Orders</Text>
    </View>
  )
}

export default EarningCard

const styles = StyleSheet.create({
    cardContainer: {
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    }
})
