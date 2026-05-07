import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { 
    useAnimatedStyle, 
    withTiming, 
    useSharedValue, 
    interpolateColor 
} from 'react-native-reanimated';

interface Props {
    value: boolean;
    onValueChange: (value: boolean) => void;
    activeColor?: string;
    inactiveColor?: string;
}

const CustomSwitch = ({ 
    value, 
    onValueChange, 
    activeColor = '#1E1E1E', 
    inactiveColor = '#D9D9D9' 
}: Props) => {
    const translateX = useSharedValue(value ? 20 : 2);

    useEffect(() => {
        translateX.value = withTiming(value ? 20 : 2, { duration: 250 });
    }, [value, translateX]);

    const animatedTrackStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            translateX.value,
            [2, 20],
            [inactiveColor, activeColor]
        );
        return {
            backgroundColor,
        };
    });

    const animatedThumbStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    return (
        <Pressable onPress={() => onValueChange(!value)}>
            <Animated.View style={[styles.track, animatedTrackStyle]}>
                <Animated.View style={[styles.thumb, animatedThumbStyle]} />
            </Animated.View>
        </Pressable>
    );
};

export default CustomSwitch;

const styles = StyleSheet.create({
    track: {
        width: 44,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
    },
    thumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
});
