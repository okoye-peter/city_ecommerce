import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Animated, { 
    useAnimatedStyle, 
    useSharedValue, 
    withRepeat, 
    withTiming, 
    Easing
} from 'react-native-reanimated';
import { Image } from 'expo-image';

interface LoadingOverlayProps {
    isVisible: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible }) => {
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);

    useEffect(() => {
        if (isVisible) {
            rotation.value = withRepeat(
                withTiming(360, { duration: 1200, easing: Easing.linear }),
                -1,
                false
            );
            scale.value = withRepeat(
                withTiming(1.18, { duration: 900, easing: Easing.inOut(Easing.ease) }),
                -1,
                true
            );
        } else {
            rotation.value = 0;
            scale.value = 1;
        }
    }, [isVisible]);

    const animatedRotation = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    const animatedScale = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    if (!isVisible) return null;

    return (
        <View style={styles.container}>
            {/* The Rotating Circle */}
            <Animated.View style={[styles.spinner, animatedRotation]} />
            
            {/* The Pulsing Logo */}
            <Animated.View style={[styles.logoContainer, animatedScale]}>
                <Image
                    source={require('../../../assets/images/Logomark.png')}
                    style={styles.logo}
                    contentFit="contain"
                    transition={300}
                />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 99999,
        justifyContent: 'center',
        alignItems: 'center',
    },
    spinner: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 3.5,
        // We use a dark color but keep one side transparent to show rotation
        borderColor: '#1E1E1E', 
        borderTopColor: '#757575', // Slightly lighter highlight for visibility
        borderRightColor: 'transparent',
    },
    logoContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 48,
        height: 48,
    },
});

export default LoadingOverlay;
