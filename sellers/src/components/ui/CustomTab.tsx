import { View, Text, Pressable, Platform } from 'react-native'
import React, { useState } from 'react'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';


const CustomTab = ({ TABS, setActiveTab, activeTab }: { TABS: string[], setActiveTab: (index: number) => void, activeTab: number }) => {

    const [measuredTabWidth, setMeasuredTabWidth] = useState(0);


    const translateX = useSharedValue(0);



    const animatedIndicatorStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });


    const handleTabPress = (index: number) => {
        setActiveTab(index);
        if (measuredTabWidth > 0) {
            translateX.value = withSpring(index * measuredTabWidth, {
                damping: 100,
                stiffness: 2000,
            });
        }
    };

    const onContainerLayout = (event: any) => {
        const { width: containerWidth } = event.nativeEvent.layout;
        // Subtract internal padding (p-1.5 = 6px on each side)
        const innerWidth = containerWidth - 12;
        setMeasuredTabWidth(innerWidth / TABS.length);
    };

    return (
        <View
            onLayout={onContainerLayout}
            className="bg-gray-100/80 rounded-2xl flex-row relative"
            style={{ height: 40 }}
        >
            {/* Sliding Indicator */}
            {measuredTabWidth > 0 && (
                <Animated.View
                    style={[
                        {
                            position: 'absolute',
                            top: 6,
                            left: 6,
                            width: measuredTabWidth,
                            height: 28,
                            backgroundColor: '#ffffff',
                            borderRadius: 12,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                        },
                        animatedIndicatorStyle
                    ]}
                />
            )}

            {TABS.map((tab, index) => (
                <Pressable
                    key={tab}
                    onPress={() => handleTabPress(index)}
                    className="flex-1 items-center justify-center z-10"
                >
                    <Text className={`font-Inter-medium ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'} ${activeTab === index ? 'text-primary' : 'text-muted-foreground'}`}>
                        {tab}
                    </Text>
                </Pressable>
            ))}
        </View>
    )
}

export default CustomTab