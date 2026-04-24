import { View, Text, Platform } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import CustomButton from '@/components/ui/common/CustomButton'

const Offline = ({ goOnlineHandler }: { goOnlineHandler: () => void }) => {
  return (
    <View className='flex-1 items-center justify-center pt-16'>
        <View className='h-[230px] w-[300px]'>
            <Image
                source={require('@/assets/images/home_screen/offline-shop-icon.jpg')}
                style={{ width: '100%', height: '100%' }}
            />
        </View>
        <Text className={`font-inter font-medium text-primary mb-2 mt-6 ${Platform.OS === 'ios' ? 'text-lg' : 'text-xl'}`}>Your shop is offline</Text>
        <Text className={`font-inter font-normal text-secondary mb-4 ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>Buyers cannot place new orders right now.</Text>
        <CustomButton buttonText='Go Online' onPressHandler={goOnlineHandler} classStyle='w-full' />
    </View>
  )
}

export default Offline