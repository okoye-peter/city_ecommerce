import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    Easing
} from 'react-native-reanimated'
import { Image } from 'expo-image'

const CustomSplash = () => {
    const logoScale = useSharedValue(0.8)
    const logoOpacity = useSharedValue(0)
    const textOpacity = useSharedValue(0)
    const textTranslateY = useSharedValue(10)

    useEffect(() => {
        logoScale.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) })
        logoOpacity.value = withTiming(1, { duration: 800 })

        textOpacity.value = withDelay(500, withTiming(1, { duration: 800 }))
        textTranslateY.value = withDelay(500, withTiming(0, { duration: 800, easing: Easing.out(Easing.back(1)) }))
    }, [logoScale, logoOpacity, textOpacity, textTranslateY])

    const logoStyle = useAnimatedStyle(() => ({
        opacity: logoOpacity.value,
        transform: [{ scale: logoScale.value }]
    }))

    const textStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [{ translateY: textTranslateY.value }]
    }))

    return (
        <View className='flex-1 items-center justify-center bg-white'>
            <Animated.View style={logoStyle} className="items-center justify-center">
                <View className="w-fit bg-white items-center justify-center">
                    <Image
                        source={require("../../../assets/images/Logomark.png")}
                        style={{ width: 50, height: 50 }}
                        contentFit="contain"
                    />
                </View>
            </Animated.View>

            <Animated.View style={textStyle} className="items-center mt-3">
                <Text className='text-3xl font-semibold text-body '>
                    City Commerce
                </Text>
                <View className="mt-3 px-4 py-1.5 rounded-full border border-body">
                    <Text className='text-sm font-semibold text-body uppercase tracking-[0.2em]'>
                        Sellers Edition
                    </Text>
                </View>
            </Animated.View>

        </View>
    )
}

export default CustomSplash