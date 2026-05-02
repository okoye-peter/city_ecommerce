import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Platform,
} from 'react-native';
import {
    BottomSheetModal,
    BottomSheetFlatList,
    BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import CustomBottomSheet from './CustomBottomSheet';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, {
    useAnimatedStyle,
    withTiming,
    FadeIn,
} from 'react-native-reanimated';

interface Props {
    data: { label: string, value: string | number | boolean }[] | { label: string, id: string | number | boolean }[];
    value: string | number | null;
    onChange: (item: { label: string, value: string | number | boolean } | { label: string, id: string | number | boolean }) => void;
    placeholder?: string;
    label?: string;
    searchable?: boolean;
    keyField?: string;
    labelField?: string;
}

const BottomSheetDropdown = ({
    data,
    value,
    onChange,
    placeholder = 'Select item',
    label,
    searchable = true,
    keyField = 'id',
    labelField = 'label',
}: Props) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const snapPoints = useMemo(() => ['45%', '85%'], []);

    const filteredData = useMemo(() => {
        if (!searchQuery) return data;
        return data.filter((item) =>
            item[labelField]
                ?.toString()
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        );
    }, [data, searchQuery, labelField]);

    const handlePresentModalPress = useCallback(() => {
        setIsOpen(true);
        bottomSheetModalRef.current?.present();
    }, []);

    const handleDismiss = useCallback(() => {
        setIsOpen(false);
        setSearchQuery('');
    }, []);

    const handleSelectItem = useCallback((item: any) => {
        onChange(item);
        bottomSheetModalRef.current?.dismiss();
    }, [onChange]);

    const selectedItem = useMemo(
        () => data.find((item) => item[keyField] === value),
        [data, value, keyField]
    );

    const animatedTriggerStyle = useAnimatedStyle(() => {
        return {
            borderColor: withTiming(isOpen ? '#2C2C2C' : '#D9D9D9', { duration: 300 }),
            transform: [{ scale: withTiming(isOpen ? 1.02 : 1, { duration: 250 }) }],
        };
    });

    return (
        <View className="mb-4 w-full">
            {label && (
                <Text className={`mb-2 font-inter-semibold text-body ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>
                    {label}
                </Text>
            )}

            <TouchableOpacity activeOpacity={0.7} onPress={handlePresentModalPress}>
                <Animated.View
                    className="py-2.5 flex-row items-center justify-between rounded-xl border bg-transparent px-4"
                    style={animatedTriggerStyle}
                >
                    <Text
                        className={`mr-2 flex-1 font-inter ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'
                            } ${selectedItem ? 'text-body' : 'text-secondary'}`}
                        numberOfLines={1}
                    >
                        {selectedItem ? selectedItem[labelField] : placeholder}
                    </Text>
                    <MaterialIcons
                        name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                        size={24}
                        color="#757575"
                    />
                </Animated.View>
            </TouchableOpacity>

            <CustomBottomSheet
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                onDismiss={handleDismiss}
            >
                <View className="flex-1 px-4 pt-2">
                    {searchable && (
                        <View className="mb-4 h-12 flex-row items-center rounded-lg bg-light px-3">
                            <MaterialIcons name="search" size={20} color="#757575" />
                            <BottomSheetTextInput
                                className="ml-2 flex-1 font-inter text-[15px] text-body"
                                placeholder="Search..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholderTextColor="#A9A9A9"
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery('')}>
                                    <MaterialIcons name="cancel" size={20} color="#D9D9D9" />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    <BottomSheetFlatList
                        data={filteredData}
                        keyExtractor={(item, index) => item[keyField]?.toString() || index.toString()}
                        renderItem={({ item }) => {
                            const isSelected = item[keyField] === value;
                            return (
                                <TouchableOpacity
                                    className={`mb-1 flex-row items-center justify-between rounded-lg px-3 py-3.5 ${isSelected ? 'bg-primary/5' : ''
                                        }`}
                                    onPress={() => handleSelectItem(item)}
                                >
                                    <Text
                                        className={`font-inter text-[15px] ${isSelected
                                                ? 'font-inter-semibold text-primary'
                                                : 'text-body'
                                            }`}
                                    >
                                        {item[labelField]}
                                    </Text>
                                    {isSelected && (
                                        <MaterialIcons name="check" size={20} color="#2C2C2C" />
                                    )}
                                </TouchableOpacity>
                            );
                        }}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={() => (
                            <Animated.View
                                entering={FadeIn}
                                className="items-center pt-10"
                            >
                                <Text className="font-inter text-sm text-secondary">
                                    No items found
                                </Text>
                            </Animated.View>
                        )}
                    />
                </View>
            </CustomBottomSheet>
        </View>
    );
};

export default BottomSheetDropdown;

const styles = StyleSheet.create({
    listContent: {
        paddingBottom: 40,
    },
});
