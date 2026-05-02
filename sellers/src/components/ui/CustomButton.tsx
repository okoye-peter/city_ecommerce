import { Text, Pressable, Platform } from 'react-native'
import React from 'react'

const CustomButton = ({ buttonText, onPressHandler, disabled, classStyle, textClassStyle }: { buttonText: string, onPressHandler: () => void, disabled?: boolean, classStyle?: string, textClassStyle?: string }) => {
    return (
        <Pressable
            onPress={onPressHandler}
            disabled={disabled}
            style={({ pressed }: { pressed: boolean }) => ({ opacity: pressed ? 0.8 : 1 })}
            className={`bg-primary rounded-full items-center justify-center py-4 ${disabled ? 'opacity-50' : ''} ${classStyle}`}
        >
            <Text className={`text-light ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} font-normal ${textClassStyle}`}>{buttonText}</Text>
        </Pressable>
    )
}

export default CustomButton;