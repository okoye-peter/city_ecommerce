import { View, Text, Platform } from 'react-native'
import React from 'react'

export default function SetupHeader({title, subHeader}: { title: string, subHeader: string }) {
  return (
    <View className='border-b-4 border-light'>
        <View className='px-8 py-3'>
            <Text className={`text-[#303030] ${Platform.OS === 'ios' ? 'text-base' : 'text-xl'}`}>{title}</Text>
            <Text className={`text-secondary ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>{subHeader}</Text>
        </View>
    </View>
  )
}