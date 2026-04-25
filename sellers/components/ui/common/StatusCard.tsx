import { View, Text, Platform } from 'react-native'
import React from 'react'
import { statusClass, StatusType } from '@/utils/statusClass'

const StatusCard = ({status}: {status: StatusType}) => {
    const statusClassName = statusClass(status)
    console.log('status', statusClassName)
    return (
        <View className={`${statusClassName.container} px-2.5 py-[2.5px] border rounded-full`}>
            <Text className={`capitalize ${statusClassName.text} ${Platform.OS === 'ios' ? 'text-xs' : 'text-sm'} font-normal font-Inter `}>{status.split('_').join(' ')}</Text>
        </View>
    )
}

export default StatusCard