import { View, Text, Platform, StyleSheet } from 'react-native'
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { formatCompactNumber, formatPrice } from '@/utils/priceFormatter';
import Feather from '@expo/vector-icons/Feather';


const EarningCard = ({ amount, total }: { amount: number, total: number }) => {
  return (
    <View className='w-full px-4 py-5 bg-light rounded-xl' style={styles.cardContainer}>
        <View className='flex-row justify-between mb-6'>
            <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal text-black-light leading-6`}>Today&apos;s Earnings</Text>
            <MaterialIcons name="arrow-forward-ios" size={14} color="text-black-light" />
        </View>

        {/* price */}
        <View className='flex-row justify-between mb-3'>
            <Text className={`${Platform.OS === 'ios' ? 'text-2xl' : 'text-3xl'} font-medium text-black-light leading-6`}>{formatPrice(amount)}</Text>
            {/* increase */}
            <View className='flex-row items-center gap-2'>
                <Feather name="trending-up" size={20} color="green" />
                <Text className={`${Platform.OS === 'ios' ? 'text-sm' : 'text-base'} font-normal text-green-600`}>12% from yesterday</Text>
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