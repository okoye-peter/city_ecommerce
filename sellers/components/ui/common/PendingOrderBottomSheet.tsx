import { View, Text, Platform, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import CustomBottomSheet from './CustomBottomSheet'
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import AntDesign from '@expo/vector-icons/AntDesign';
import Svg, { Circle } from 'react-native-svg';
import Animated, { 
    useAnimatedProps, 
    useSharedValue, 
    withTiming, 
    Easing 
} from 'react-native-reanimated';
import CustomButton from './CustomButton';
import ProductCard from '@/components/Orders/ProductCard';
import { formatPrice } from '@/utils/priceFormatter';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const PendingOrderBottomSheet = () => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [timeLeft, setTimeLeft] = useState(90);
    const progress = useSharedValue(1);

    // SVG Constants
    const size = 150;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    // Automatically open the sheet when this component mounts
    useEffect(() => {
        const timer = setTimeout(() => {
            bottomSheetRef.current?.present();
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Countdown Logic
    useEffect(() => {
        if (timeLeft <= 0) {
            bottomSheetRef.current?.dismiss();
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    // Progress Animation Logic
    useEffect(() => {
        progress.value = withTiming(timeLeft / 90, { 
            duration: 1000, 
            easing: Easing.linear 
        });
    }, [timeLeft]);

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: circumference * (1 - progress.value),
    }));

    return (
        <>
            <CustomBottomSheet
                ref={bottomSheetRef}
                snapPoints={['50%', '65%', '85%']}
                enablePanDownToClose={true}
                handleComponent={null}
                index={1}
                backgroundStyle={{ borderRadius: 24 }}
            >
                <View className='flex-1 px-6 pt-4 overflow-hidden rounded-t-3xl'>
                    {/* Header */}
                    <View className='flex-row items-center justify-between mb-3'>
                        <Text className={`font-inter-semibold ${Platform.OS === 'ios' ? 'text-xl' : 'text-2xl'} text-body`}>
                            New Order
                        </Text>
                        <Pressable 
                            onPress={() => bottomSheetRef.current?.dismiss()} 
                            className='bg-light p-2.5 border border-border rounded-full'
                        >
                            <AntDesign name="close" size={14} color="black" />
                        </Pressable>
                    </View>

                    {/* Animated Countdown UI */}
                    <View className='items-center justify-center flex-1 mt-4'>
                        <View className='items-center justify-center' style={{ width: size, height: size }}>
                            <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
                                {/* Background Circle (Gray) */}
                                <Circle
                                    cx={size / 2}
                                    cy={size / 2}
                                    r={radius}
                                    stroke="#E5E7EB"
                                    strokeWidth={strokeWidth}
                                    fill="none"
                                />
                                {/* Progress Circle (Black/Body) */}
                                <AnimatedCircle
                                    cx={size / 2}
                                    cy={size / 2}
                                    r={radius}
                                    stroke="#1F2937" // Matching 'text-body' color
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={circumference}
                                    animatedProps={animatedProps}
                                    strokeLinecap="round"
                                    fill="none"
                                />
                            </Svg>
                            
                            {/* Time Text (Overlayed) */}
                            <View className='absolute inset-0 items-center justify-center'>
                                <Text className='text-5xl font-inter-bold text-body'>
                                    {timeLeft}
                                </Text>
                            </View>
                        </View>
                        
                        <View className='items-center mt-4'>
                            <Text className={`font-inter-semibold text-body mb-1 ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>
                                ORD-2026-0898
                            </Text>
                            <Text className={`text-secondary font-inter ${Platform.OS === 'ios' ? 'text-xs' : 'text-sm'}`}>
                                Closing in {timeLeft} seconds
                            </Text>
                        </View>
                    </View>

                    {/* Product */}

                    <View className='items-center py-4 my-3 gap-x-4 border-y border-border'>
                        <ProductCard 
                        />
                    </View>

                    {/* total */}
                    <View className='flex-row items-center justify-between my-2'>
                        <Text className={`font-inter-semibold text-body ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>
                            Total
                        </Text>
                        <Text className={`font-inter-semibold text-body ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>
                            {formatPrice(15000)}
                        </Text>
                    </View>

                    {/* Action Buttons */}
                    <View className='flex-row gap-4 pt-4 pb-6'>
                        <CustomButton
                            buttonText='Decline'
                            onPressHandler={() => {}}
                            classStyle='!bg-reject !flex-1'
                            textClassStyle='!text-primary'
                        />
                        <CustomButton
                            buttonText='Accept Order'
                            onPressHandler={() => {}}
                            classStyle='!flex-1'
                        />
                    </View>
                </View>
            </CustomBottomSheet>
        </>
    )
}

export default PendingOrderBottomSheet