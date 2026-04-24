import { View, Text } from 'react-native'
import React from 'react'
import EarningCard from './EarningCard'

const Online = () => {
    return (
        <View className=''>
            <View className='py-4 border-b-4 border-muted-neutral/60 px-6'>
                <EarningCard amount={111.13} total={69} />
            </View>
            
        </View>
    )
}

export default Online