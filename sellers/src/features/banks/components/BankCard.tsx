import { View, Text, Platform, Pressable } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Octicons from '@expo/vector-icons/Octicons';
import Feather from '@expo/vector-icons/Feather';

const BankCard = ({ name, accountNumber, isSelected }: { name: string; accountNumber: string, isSelected?: boolean }) => {
    return (
        <Pressable className=''>
            <View className='border-b pb-3 border-border/60 flex-row items-center gap-3'>
                <View className='items-center justify-center bg-light p-3 rounded-full'>
                    <FontAwesome name="university" size={16} color="#757575" />
                </View>

                <View className='flex-1'>
                    <Text numberOfLines={1} className={`font-medium text-primary ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>{name}</Text>
                    <Text numberOfLines={1} className={`font-medium text-secondary ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>{accountNumber.replace(/.(?=.{4})/g, '*')}</Text>
                </View>

                {isSelected && <Octicons name="dot" size={24} color="black" />}
            </View>
            <View className='flex-row justify-end gap-4 mt-3 items-center'>
                <Pressable>
                    <Feather name="edit-3" size={20} color="#757575" />
                </Pressable>
                <Pressable>
                    <Feather name="trash-2" size={20} color="#757575" />
                </Pressable>
            </View>
        </Pressable>
    )
}

export default BankCard
