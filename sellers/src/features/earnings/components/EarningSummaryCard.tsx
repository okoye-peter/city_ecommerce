import { View, Text, StyleSheet, Platform } from 'react-native'
import React from 'react'
import { formatPrice } from '@/src/utils/priceFormatter'
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Feather from '@expo/vector-icons/Feather';

const Sparkline = ({ trend }: { trend: 'up' | 'down' }) => {
    const isUp = trend === 'up';
    const color = isUp ? '#039855' : '#D92D20';
    const gradientId = `gradient-${trend}`;

    const points = isUp
        ? "M0,15 L10,12 L20,16 L30,5 L40,12 L50,8 L60,2"
        : "M0,5 L10,8 L20,4 L30,15 L40,8 L50,12 L60,18";

    const fillPath = `${points} L60,25 L0,25 Z`;

    return (
        <Svg width="70" height="30" viewBox="0 0 60 25">
            <Defs>
                <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor={color} stopOpacity="0.2" />
                    <Stop offset="100%" stopColor={color} stopOpacity="0" />
                </LinearGradient>
            </Defs>
            <Path d={fillPath} fill={`url(#${gradientId})`} />
            <Path d={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
};

const EarningSummaryCard = ({ trend = 'up', percentage = 12 }: { trend?: 'up' | 'down', percentage?: number }) => {
    const isUp = trend === 'up';
    const trendColor = isUp ? 'text-success-dark' : 'text-error-dark';
    const trendIconColor = isUp ? '#039855' : '#D92D20';

    return (
        <View className='bg-light border-border rounded-lg p-4' style={styles.card}>
            <Text className={`font-normal text-secondary mb-2 ${Platform.OS == 'ios' ? 'text-sm' : 'text-base'}`}>Today&apos;s Earnings</Text>

            <View className='flex-row items-end justify-between mt-4'>
                <View>
                    <Text className={`font-semibold text-primary mb-1 ${Platform.OS == 'ios' ? 'text-2xl' : 'text-3xl'}`}>
                        {formatPrice(117000)}
                    </Text>

                    <View className='flex-row items-center'>
                        <Feather name={isUp ? "trending-up" : "trending-down"} size={16} color={trendIconColor} />
                        <Text className={`ml-1 font-inter-semibold ${trendColor} ${Platform.OS === 'ios' ? 'text-xs' : 'text-sm'}`}>
                            {isUp ? '+' : '-'}{percentage}% from yesterday
                        </Text>
                    </View>
                </View>

                <View className='pb-1'>
                    <Sparkline trend={trend} />
                </View>
            </View>

            <View className='flex-row justify-between border-border border-t mt-3  pt-3'>
                <Text className={`font-normal text-primary ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>Available: {formatPrice(50000)}</Text>

                <Text className={`font-normal text-secondary ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>In Escrow: {formatPrice(50000)}</Text>
            </View>
        </View>
    )
}

export default EarningSummaryCard

const styles = StyleSheet.create({
    card: {
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    }
})
