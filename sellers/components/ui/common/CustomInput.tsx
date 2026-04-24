import { View, Text, Platform, TextInput } from 'react-native'
import React, { useState } from 'react'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { BottomSheetTextInput } from '@gorhom/bottom-sheet'

interface Props {
    label?: string;
    value: string;
    setValue: (value: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    numberOfLines?: number,
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    prefix?: React.ReactNode;
    isBottomSheet?: boolean;
}

const CustomInput = ({
    label,
    value,
    setValue,
    placeholder,
    secureTextEntry,
    numberOfLines = 1,
    keyboardType = 'default',
    prefix,
    isBottomSheet = false
}: Props) => {
    const [isFocused, setIsFocused] = useState(false);

    // Choose the input component based on the context
    const InputComponent = isBottomSheet ? BottomSheetTextInput : TextInput;

    // Smooth focus animation for the border
    const animatedBorderStyle = useAnimatedStyle(() => {
        return {
            borderColor: withTiming(isFocused ? '#2C2C2C' : '#D9D9D9', { duration: 250 }),
        };
    });

    return (
        <View className="mb-4 w-full">
            {label && (
                <Text className={`mb-2 font-inter-semibold ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} text-body`}>
                    {label}
                </Text>
            )}

            <Animated.View
                className={`w-full flex-row rounded-xl items-center border px-3 ${numberOfLines > 1 ? 'items-start pt-2' : 'h-[50px] items-center'}`}
                style={animatedBorderStyle}
            >
                {prefix && (
                    <View className="mr-1 justify-center">
                        {typeof prefix === 'string' ? (
                            <Text
                                className={`font-inter text-body ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}
                                style={{ includeFontPadding: false }}
                            >
                                {prefix}
                            </Text>
                        ) : (
                            prefix
                        )}
                    </View>
                )}
                <InputComponent
                    className={`flex-1 font-inter ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} text-body p-0`}
                    value={value}
                    onChangeText={setValue}
                    placeholder={placeholder}
                    placeholderTextColor="#A9A9A9"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize="none"
                    multiline={numberOfLines > 1}
                    numberOfLines={numberOfLines}
                    style={[
                        { textAlignVertical: numberOfLines > 1 ? 'top' : 'center' },
                        numberOfLines > 1 ? {
                            height: Math.max(48, numberOfLines * 24),
                            paddingTop: Platform.OS === 'ios' ? 10 : 8,
                        } : {
                            height: Platform.OS === 'android' ? 50 : undefined, // ← remove '100%'
                            textAlignVertical: 'center',
                            paddingTop: 0,
                            paddingBottom: 0,
                            ...(Platform.OS === 'ios' && {
                                minHeight: 50,          // ← match container height
                                lineHeight: undefined,  // ← let RN handle it naturally
                            }),
                        }
                    ]}
                />
            </Animated.View>
        </View>
    )
}

export default CustomInput