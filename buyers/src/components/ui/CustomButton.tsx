import { Text, Pressable, Platform } from 'react-native'
import { Animated, Easing } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useEffect, useRef } from 'react';


interface Props {
    buttonText: string,
    onPressHandler: () => void,
    disabled?: boolean,
    classStyle?: string,
    textClassStyle?: string,
    isLoading?: boolean,
    loadingIconColor?: string
}


const CustomButton = ({ buttonText, onPressHandler, disabled, classStyle, textClassStyle, isLoading, loadingIconColor }: Props) => {

    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!isLoading) return;
        rotation.setValue(0);
        const anim = Animated.loop(
            Animated.timing(rotation, {
                toValue: 1,
                duration: 800,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );
        anim.start();
        return () => anim.stop();
    }, [isLoading]);

    const spin = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

    return (
        <Pressable
            onPress={onPressHandler}
            disabled={disabled}
            style={({ pressed }: { pressed: boolean }) => ({ opacity: pressed ? 0.8 : 1 })}
            className={`bg-primary rounded-full items-center justify-center py-4 ${disabled ? 'opacity-50' : ''} ${classStyle}`}
        >
            {
                isLoading
                ?
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <AntDesign name="loading-3-quarters" size={24} color={loadingIconColor ?? 'white'} />
                </Animated.View>
                :
                <Text className={`${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal ${textClassStyle ?? 'text-white'}`}>{buttonText}</Text>
            }
        </Pressable>
    )
}

export default CustomButton;