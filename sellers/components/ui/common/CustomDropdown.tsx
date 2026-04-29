import React, { useState } from 'react';
import { StyleSheet, Text, View, Platform, useWindowDimensions, Pressable } from 'react-native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface Props {
    data: {label: string, value: string | number | boolean | null}[];
    value: any;
    onChange: (item: any) => void;
    placeholder?: string;
    label?: string;
    searchable?: boolean;
    isMulti?: boolean;
    labelField?: string;
    valueField?: string;
    containerStyle?: string;
    dropdownPosition?: 'auto' | 'top' | 'bottom';
}

const CustomDropdown = ({
    data,
    value,
    onChange,
    placeholder = 'Select item',
    label,
    searchable = false,
    isMulti = false,
    labelField = 'label',
    valueField = 'value',
    containerStyle = '',
    dropdownPosition = 'auto',
}: Props) => {
    const { height } = useWindowDimensions();
    const [isFocused, setIsFocused] = useState(false);

    // Smooth focus animation for the border
    const animatedBorderStyle = useAnimatedStyle(() => {
        return {
            borderColor: withTiming(isFocused ? '#1E1E1E' : '#E5E7EB', { duration: 250 }),
        };
    });

    const renderItem = (item: any) => {
        const isSelected = isMulti 
            ? (Array.isArray(value) && value.includes(item[valueField]))
            : value === item[valueField];

        return (
            <View className={`flex-row items-center justify-between px-4 py-2.5 ${isSelected ? 'bg-primary/5' : ''}`}>
                <Text className={`font-inter text-body ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} ${isSelected ? 'font-inter-semibold text-primary' : ''}`}>
                    {item[labelField]}
                </Text>
                {isSelected && (
                    <MaterialIcons name="check-circle" size={20} color="#2C2C2C" />
                )}
            </View>
        );
    };

    const commonProps = {
        data: data,
        labelField: labelField,
        valueField: valueField,
        placeholder: placeholder,
        search: searchable,
        searchPlaceholder: "Search...",
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
        renderItem: renderItem,
        placeholderStyle: styles.placeholderStyle,
        selectedTextStyle: styles.selectedTextStyle,
        inputSearchStyle: styles.inputSearchStyle,
        containerStyle: styles.dropdownContainer,
        activeColor: 'transparent',
        itemTextStyle: styles.itemText,
        itemContainerStyle: styles.itemContainer,
        fontFamily: 'Inter',
        dropdownPosition: dropdownPosition as any,
        maxHeight: 300,
        flatListProps: {
            showsVerticalScrollIndicator: false,
        },
        renderLeftIcon: () => (
            null
        ),
        renderRightIcon: () => (
            <Feather
                name={isFocused ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#757575"
            />
        ),
    };

    return (
        <View className={`mb-4 w-full ${containerStyle}`}>
            {label && (
                <Text className={`mb-2 font-inter-semibold text-body ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>
                    {label}
                </Text>
            )}

            <Animated.View
                className="rounded-xl border bg-transparent"
                style={[animatedBorderStyle, { minHeight: 44 }]}
            >
                {isMulti ? (
                    <View>
                        <MultiSelect
                            {...commonProps}
                            style={styles.dropdown}
                            placeholder={value && value.length > 0 ? "" : placeholder}
                            value={value}
                            onChange={onChange}
                            visibleSelectedItem={false}
                        />
                        {value && value.length > 0 && (
                            <View className="flex-row flex-wrap px-3 pb-3 -mt-10">
                                {value.map((val: any) => {
                                    const item = data.find(d => d[valueField] === val);
                                    if (!item) return null;
                                    return (
                                        <View 
                                            key={val} 
                                            className="bg-[#F3F4F6] px-3 py-1.5 rounded-xl flex-row items-center mr-2 mt-2"
                                        >
                                            <Text className="font-inter text-sm text-[#1E1E1E] mr-2">
                                                {item[labelField]}
                                            </Text>
                                            <Pressable 
                                                onPress={() => {
                                                    const newValue = value.filter((v: any) => v !== val);
                                                    onChange(newValue);
                                                }}
                                                hitSlop={8}
                                            >
                                                <Feather name="x" size={14} color="#757575" />
                                            </Pressable>
                                        </View>
                                    );
                                })}
                            </View>
                        )}
                    </View>
                ) : (
                    <Dropdown
                        {...commonProps}
                        style={styles.dropdown}
                        value={value}
                        onChange={(item) => {
                            onChange(item[valueField]);
                            setIsFocused(false);
                        }}
                    />
                )}
            </Animated.View>
        </View>
    );
};

export default CustomDropdown;

const styles = StyleSheet.create({
    dropdown: {
        minHeight: 44,
        paddingHorizontal: 12,
    },
    placeholderStyle: {
        fontSize: Platform.OS === 'ios' ? 14 : 16,
        fontFamily: 'Inter',
        color: '#9CA3AF',
    },
    selectedTextStyle: {
        fontSize: Platform.OS === 'ios' ? 13 : 15,
        fontFamily: 'Inter',
        color: '#1E1E1E',
    },
    inputSearchStyle: {
        height: 45,
        fontSize: 16,
        fontFamily: 'Inter',
        borderRadius: 10,
        backgroundColor: '#F5F5F5',
        borderWidth: 0,
        marginHorizontal: 8,
        marginVertical: 8,
    },
    dropdownContainer: {
        borderRadius: 12,
        backgroundColor: 'white',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        borderWidth: Platform.OS === 'ios' ? 0.5 : 0,
        borderColor: '#D9D9D9',
        paddingVertical: 4,
    },
    itemContainer: {
        borderRadius: 8,
    },
    itemText: {
        fontFamily: 'Inter',
        fontSize: Platform.OS === 'ios' ? 14 : 16,
    },
    selectedStyle: {
        borderRadius: 8,
        borderWidth: 0,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
});

