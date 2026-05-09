import { View, Text, Pressable, Platform, Alert } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import SetupHeader from './SetupHeader'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import AppModal from '@/src/components/ui/AppModal';
import CustomButton from '@/src/components/ui/CustomButton';
import type { ShopFormHandle } from '@/src/types';
import CustomSwitch from '@/src/components/ui/CustomSwitch';
import BottomSheetDropdown from '@/src/components/ui/BottomSheetDropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomInput from '@/src/components/ui/CustomInput';

interface Option {
    label: string,
    id: string | number | boolean
}

interface ShopFormErrors {
    image?: string;
    shopName?: string;
    market?: string;
    categories?: string;
}


export type { ShopFormData, ShopFormHandle } from '@/src/types';

const ShopForm = forwardRef<ShopFormHandle, { markets: Option[], categories: Option[] }>(
    ({ markets, categories }, ref) => {
        const [image, setImage] = useState<string | null>(null);
        const [showPermissionFailedModal, setShowPermissionFailedModal] = useState<boolean>(false);
        const [shopName, setShopName] = useState<string>('');
        const [shopDescription, setShopDescription] = useState<string>('');
        const [marketSelected, setMarketSelected] = useState<string>('');
        const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
        const [errors, setErrors] = useState<ShopFormErrors>({});

        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
        type DayName = typeof daysOfWeek[number];

        const [isHoursModalVisible, setIsHoursModalVisible] = useState(false);
        const [openingTime, setOpeningTime] = useState(new Date(2024, 0, 1, 9, 0));
        const [closingTime, setClosingTime] = useState(new Date(2024, 0, 1, 17, 30));
        const [showOpeningPicker, setShowOpeningPicker] = useState(false);
        const [showClosingPicker, setShowClosingPicker] = useState(false);
        const [openDays, setOpenDays] = useState<Record<DayName, boolean>>({
            Monday: true, Tuesday: true, Wednesday: true, Thursday: true,
            Friday: true, Saturday: true, Sunday: true,
        });

        const toggleDay = (day: DayName) => setOpenDays(prev => ({ ...prev, [day]: !prev[day] }));

        const formatTimeDisplay = (date: Date) =>
            date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

        const toHHMM = (date: Date) =>
            `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

        const getDisplayDays = () => {
            const activeDays = daysOfWeek.filter(day => openDays[day]);
            if (activeDays.length === 0) return 'Closed';
            if (activeDays.length === 7) return 'Monday - Sunday';
            const getShort = (d: string) => d.substring(0, 3);
            const ranges: string[] = [];
            let startIdx = 0;
            while (startIdx < activeDays.length) {
                let endIdx = startIdx;
                while (
                    endIdx + 1 < activeDays.length &&
                    daysOfWeek.indexOf(activeDays[endIdx + 1]) === daysOfWeek.indexOf(activeDays[endIdx]) + 1
                ) endIdx++;
                ranges.push(startIdx === endIdx
                    ? getShort(activeDays[startIdx])
                    : `${getShort(activeDays[startIdx])} - ${getShort(activeDays[endIdx])}`);
                startIdx = endIdx + 1;
            }
            return ranges.join(', ');
        };

        useImperativeHandle(ref, () => ({
            validate() {
                const newErrors: ShopFormErrors = {};
                if (!image) newErrors.image = 'A shop image is required';
                if (!shopName.trim()) newErrors.shopName = 'Shop name is required';
                if (!marketSelected) newErrors.market = 'Please select a market';
                if (selectedCategories.length === 0) newErrors.categories = 'Select at least one category';
                setErrors(newErrors);
                return Object.keys(newErrors).length === 0;
            },
            getData() {
                const activeDays = daysOfWeek
                    .filter(day => openDays[day])
                    .map(day => day.toUpperCase());
                return {
                    image, shopName, shopDescription, marketSelected, selectedCategories,
                    openDays: activeDays,
                    openingTime: toHHMM(openingTime),
                    closingTime: toHHMM(closingTime),
                };
            },
        }));

        const handleSelectCategories = (id: string) => {
            setSelectedCategories(prev =>
                prev.includes(id) ? prev.filter(cat => cat !== id) : [...prev, id]
            );
            if (errors.categories) setErrors(prev => ({ ...prev, categories: undefined }));
        };

        const launchGallery = async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                setShowPermissionFailedModal(true);
                return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 1,
                allowsMultipleSelection: false,
            });
            if (!result.canceled) {
                setImage(result.assets[0].uri);
                if (errors.image) setErrors(prev => ({ ...prev, image: undefined }));
            }
        };

        const launchCamera = async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                setShowPermissionFailedModal(true);
                return;
            }
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 1,
            });
            if (!result.canceled) {
                setImage(result.assets[0].uri);
                if (errors.image) setErrors(prev => ({ ...prev, image: undefined }));
            }
        };

        const pickImage = () => {
            Alert.alert('Upload Shop Image', 'Choose how to add your shop image', [
                { text: 'Take Photo', onPress: launchCamera },
                { text: 'Choose from Gallery', onPress: launchGallery },
                { text: 'Cancel', style: 'cancel' },
            ]);
        };

        const removeImage = () => setImage(null);

        return (
            <>
                <View className='flex-1'>
                    <SetupHeader title='Set up your shop' subHeader='Tell buyers who you are and what you sell.' />
                    <View className='flex-1 px-8 mt-4'>
                        <View className='mb-6'>
                            <View className='flex-row items-center gap-3'>
                            <View className='relative'>
                                <Pressable
                                    onPress={!image ? pickImage : undefined}
                                    className={`w-16 h-16 rounded-full border border-dashed border-secondary bg-light items-center justify-center overflow-hidden ${image ? 'border-none' : ''}`}
                                >
                                    {image ? (
                                        <>
                                            <Image
                                                source={{ uri: image }}
                                                style={{ width: '100%', height: '100%' }}
                                                contentFit="cover"
                                            />
                                            <View className='absolute inset-0 items-center justify-center bg-black/30'>
                                                <Pressable
                                                    onPress={removeImage}
                                                    className='p-2 rounded-full bg-white/20 backdrop-blur-md'
                                                >
                                                    <Ionicons name="close" size={24} color="white" />
                                                </Pressable>
                                            </View>
                                        </>
                                    ) : (
                                        <Ionicons name="storefront-outline" size={20} color="#757575" />
                                    )}
                                </Pressable>
                            </View>
                            <View>
                                <Text className={`font-medium font-Inter ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>Shop Image</Text>
                                <Text className={`text-secondary ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>Tap to upload</Text>
                            </View>
                            </View>
                            {errors.image && (
                                <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 6 }}>{errors.image}</Text>
                            )}
                        </View>

                        <View className='mb-1'>
                            <CustomInput
                                label='Shop name'
                                placeholder='Enter the name of your shop'
                                value={shopName}
                                setValue={(v) => {
                                    setShopName(v);
                                    if (errors.shopName) setErrors(prev => ({ ...prev, shopName: undefined }));
                                }}
                                error={errors.shopName}
                            />
                        </View>

                        <View className='mb-2'>
                            <CustomInput
                                label='Description'
                                placeholder='What do you sell? What makes your shop special?'
                                value={shopDescription}
                                setValue={(value) => {
                                    if (value.length <= 1000) setShopDescription(value);
                                }}
                                numberOfLines={4}
                            />
                            <Text className={`text-secondary ml-auto ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>{shopDescription.length}/1000 characters</Text>
                        </View>

                        <View className='mb-2'>
                            <BottomSheetDropdown
                                label='Market'
                                placeholder='Select a market'
                                value={marketSelected}
                                data={markets}
                                searchable={true}
                                onChange={(item) => {
                                    if ('id' in item) setMarketSelected(String(item.id));
                                    else if ('value' in item) setMarketSelected(String(item.value));
                                    if (errors.market) setErrors(prev => ({ ...prev, market: undefined }));
                                }}
                            />
                            {errors.market && (
                                <Text style={{ color: '#EF4444', fontSize: 12, marginTop: -12, marginBottom: 8 }}>{errors.market}</Text>
                            )}
                        </View>

                        <View>
                            <Text className={`font-normal font-Inter ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>Categories (Select up to 3)</Text>

                            <View className='flex-row flex-wrap w-full gap-3 pb-4 mt-3'>
                                {categories.map((cat) => (
                                    <Pressable key={cat.id.toString()} onPress={() => handleSelectCategories(cat.id.toString())}>
                                        <Text
                                            className={`px-3 py-1.5 rounded-lg ${Platform.OS === 'ios' ? 'text-xs' : 'text-sm'} ${selectedCategories.includes(cat.id.toString()) ? 'text-white bg-primary' : 'text-secondary bg-light'}`}
                                            style={{ includeFontPadding: false }}
                                        >
                                            {cat.label}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                            {errors.categories && (
                                <Text style={{ color: '#EF4444', fontSize: 12, marginTop: -8 }}>{errors.categories}</Text>
                            )}
                        </View>

                        {/* Opening Hours */}
                        <View className='pt-6 mt-2 border-t border-border/50'>
                            <Text className={`font-normal font-Inter ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} mb-1`}>Opening hours</Text>
                            <Pressable
                                className='flex-row items-center justify-between py-2'
                                onPress={() => setIsHoursModalVisible(true)}
                            >
                                <Text className={`text-secondary ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>
                                    {getDisplayDays()} <Text className='text-muted-foreground'>|</Text> {formatTimeDisplay(openingTime)} - {formatTimeDisplay(closingTime)}
                                </Text>
                                <Feather name='chevron-right' size={20} color='#757575' />
                            </Pressable>
                        </View>
                    </View>
                </View>

                <AppModal
                    isVisible={showPermissionFailedModal}
                    onClose={() => setShowPermissionFailedModal(false)}
                    title="Permission Denied"
                >
                    <View>
                        <Text className={`text-body text-base font-normal ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} mb-6`}>
                            We need access to your camera or gallery to upload your shop image. Please enable the required permission in your device settings to continue.
                        </Text>
                        <CustomButton
                            buttonText="Okay"
                            onPressHandler={() => setShowPermissionFailedModal(false)}
                        />
                    </View>
                </AppModal>

                <AppModal
                    isVisible={isHoursModalVisible}
                    onClose={() => setIsHoursModalVisible(false)}
                    title="Set Opening Hours"
                >
                    <View className='pt-2 space-y-6'>
                        <View className='space-y-3'>
                            <Text className='text-sm text-muted-foreground font-inter-medium'>Days open</Text>
                            <View className='bg-gray-50/80 rounded-3xl p-1.5 border border-gray-100'>
                                {daysOfWeek.map((day) => (
                                    <View key={day} className='flex-row items-center justify-between px-4 py-2 border-b border-gray-100/50 last:border-0'>
                                        <Text className='font-inter text-body'>{day}</Text>
                                        <CustomSwitch value={openDays[day]} onValueChange={() => toggleDay(day)} />
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View className='flex-row gap-3 mt-4'>
                            <View className='flex-1 space-y-2'>
                                <Text className='px-1 text-xs tracking-wider uppercase text-muted-foreground font-inter-medium'>Opens at</Text>
                                <Pressable
                                    onPress={() => { setShowOpeningPicker(true); setShowClosingPicker(false); }}
                                    className={`h-14 rounded-2xl border items-center justify-center ${showOpeningPicker ? 'bg-primary/5 border-primary' : 'bg-gray-50 border-gray-100'}`}
                                >
                                    <Text className='text-lg font-inter-bold text-primary'>{formatTimeDisplay(openingTime)}</Text>
                                </Pressable>
                            </View>
                            <View className='flex-1 space-y-2'>
                                <Text className='px-1 text-xs tracking-wider uppercase text-muted-foreground font-inter-medium'>Closes at</Text>
                                <Pressable
                                    onPress={() => { setShowClosingPicker(true); setShowOpeningPicker(false); }}
                                    className={`h-14 rounded-2xl border items-center justify-center ${showClosingPicker ? 'bg-primary/5 border-primary' : 'bg-gray-50 border-gray-100'}`}
                                >
                                    <Text className='text-lg font-inter-bold text-primary'>{formatTimeDisplay(closingTime)}</Text>
                                </Pressable>
                            </View>
                        </View>

                        {(showOpeningPicker || showClosingPicker) && (
                            <View className='items-center justify-center py-6 mt-4 border bg-gray-50/50 rounded-3xl border-gray-100/50'>
                                <DateTimePicker
                                    value={showOpeningPicker ? openingTime : closingTime}
                                    mode='time'
                                    is24Hour={false}
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(_, selectedDate) => {
                                        if (Platform.OS === 'android') {
                                            setShowOpeningPicker(false);
                                            setShowClosingPicker(false);
                                        }
                                        if (selectedDate) {
                                            if (showOpeningPicker) setOpeningTime(selectedDate);
                                            else setClosingTime(selectedDate);
                                        }
                                    }}
                                />
                                {Platform.OS === 'ios' && (
                                    <Pressable
                                        onPress={() => { setShowOpeningPicker(false); setShowClosingPicker(false); }}
                                        className='px-10 py-3 mt-4 bg-primary rounded-2xl'
                                    >
                                        <Text className='text-white font-inter-semibold'>Confirm selection</Text>
                                    </Pressable>
                                )}
                            </View>
                        )}

                        <View className='pt-4'>
                            <CustomButton buttonText='Done' onPressHandler={() => setIsHoursModalVisible(false)} />
                        </View>
                    </View>
                </AppModal>
            </>
        );
    }
);

ShopForm.displayName = 'ShopForm';

export default ShopForm;
