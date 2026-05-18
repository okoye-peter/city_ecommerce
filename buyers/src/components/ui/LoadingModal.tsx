import { View, Text, Modal, StyleSheet, Animated, Easing } from 'react-native'
import { Image } from 'expo-image'
import React, { useEffect, useRef } from 'react'

const RING_SIZE = 104
const LOGO_SIZE = 64

const LoadingModal = ({ visible, text = 'Loading...' }: { visible: boolean; text?: string }) => {
    const spinValue = useRef(new Animated.Value(0)).current
    const pulseScale = useRef(new Animated.Value(0.96)).current
    const textOpacity = useRef(new Animated.Value(0.35)).current

    useEffect(() => {
        if (!visible) return

        const spin = Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        )

        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseScale, {
                    toValue: 1.08,
                    duration: 900,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseScale, {
                    toValue: 0.96,
                    duration: 900,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        )

        const textPulse = Animated.loop(
            Animated.sequence([
                Animated.timing(textOpacity, {
                    toValue: 1,
                    duration: 850,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(textOpacity, {
                    toValue: 0.35,
                    duration: 850,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        )

        spin.start()
        pulse.start()
        textPulse.start()

        return () => {
            spin.stop()
            pulse.stop()
            textPulse.stop()
            spinValue.setValue(0)
            pulseScale.setValue(0.96)
            textOpacity.setValue(0.35)
        }
    }, [visible])

    const rotate = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    })

    return (
        <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
            <View className="flex-1 bg-black/60 items-center justify-center">

                {/* Ring + Logo stacked */}
                <View style={{ width: RING_SIZE, height: RING_SIZE, alignItems: 'center', justifyContent: 'center' }}>

                    {/* Rotating arc ring */}
                    <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ rotate }] }]}>
                        <View style={styles.ring} />
                    </Animated.View>

                    {/* Pulsing logo */}
                    <Animated.View style={{ transform: [{ scale: pulseScale }] }}>
                        <Image
                            source={require('@/assets/images/icon.png')}
                            style={styles.logo}
                            contentFit="contain"
                        />
                    </Animated.View>
                </View>

                {/* Pulsing text */}
                <Animated.View style={{ opacity: textOpacity, marginTop: 28 }}>
                    <Text className="font-Inter-SemiBold text-white text-base">
                        {text}
                    </Text>
                </Animated.View>

            </View>
        </Modal>
    )
}

export default LoadingModal

const styles = StyleSheet.create({
    ring: {
        width: RING_SIZE,
        height: RING_SIZE,
        borderRadius: RING_SIZE / 2,
        borderWidth: 3.5,
        borderTopColor: '#ffffff',
        borderRightColor: '#ffffff',
        borderBottomColor: 'rgba(255,255,255,0.15)',
        borderLeftColor: 'rgba(255,255,255,0.15)',
    },
    logo: {
        width: LOGO_SIZE,
        height: LOGO_SIZE,
        borderRadius: 14,
    },
})
