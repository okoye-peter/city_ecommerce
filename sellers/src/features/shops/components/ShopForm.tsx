import { View, Text, Pressable, Platform, Alert } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import SetupHeader from './SetupHeader'
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import AppModal from '@/src/components/ui/AppModal';
import CustomButton from '@/src/components/ui/CustomButton';
import CustomInput from '@/src/components/ui/CustomInput';
import BottomSheetDropdown from '@/src/components/ui/BottomSheetDropdown';

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

export interface ShopFormData {
    image: string | null;
    shopName: string;
    shopDescription: string;
    marketSelected: string;
    selectedCategories: string[];
}

export interface ShopFormHandle {
    validate: () => boolean;
    getData: () => ShopFormData;
}

const ShopForm = forwardRef<ShopFormHandle, { markets: Option[], categories: Option[] }>(
    ({ markets, categories }, ref) => {
        const [image, setImage] = useState<string | null>(null);
        const [showPermissionFailedModal, setShowPermissionFailedModal] = useState<boolean>(false);
        const [shopName, setShopName] = useState<string>('');
        const [shopDescription, setShopDescription] = useState<string>('');
        const [marketSelected, setMarketSelected] = useState<string>('');
        const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
        const [errors, setErrors] = useState<ShopFormErrors>({});

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
                return { image, shopName, shopDescription, marketSelected, selectedCategories };
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
            </>
        );
    }
);

export default ShopForm;
