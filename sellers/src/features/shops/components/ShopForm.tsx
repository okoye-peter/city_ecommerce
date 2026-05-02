import { View, Text, Pressable, Platform, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import SetupHeader from './SetupHeader'
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import AppModal from '@/src/components/ui/AppModal';
import CustomButton from '@/src/components/ui/CustomButton';
import CustomInput from '@/src/components/ui/CustomInput';
import BottomSheetDropdown from '@/src/components/ui/BottomSheetDropdown';

const markets = [
    { label: 'Market 1', id: 'market1' },
    { label: 'Market 2', id: 'market2' },
    { label: 'Market 3', id: 'market3' },
    { label: 'Market 4', id: 'market4' },
    { label: 'Market 5', id: 'market5' },
]

const categories = [
    { label: 'Category 1', id: 'category1' },
    { label: 'Category 2', id: 'category2' },
    { label: 'Category 3', id: 'category3' },
    { label: 'Category 4', id: 'category4' },
    { label: 'Category 5', id: 'category5' },
    { label: 'Category 6', id: 'category6' },
    { label: 'Category 7', id: 'category7' },
    { label: 'Category 8', id: 'category8' },
    { label: 'Category 9', id: 'category9' },
    { label: 'Category 10', id: 'category10' },
    { label: 'Category 11', id: 'category11' },
    { label: 'Category 12', id: 'category12' },
    { label: 'Category 13', id: 'category13' },
    { label: 'Category 14', id: 'category14' },
    { label: 'Category 15', id: 'category15' },
    { label: 'Category 16', id: 'category16' },
    { label: 'Category 17', id: 'category17' },
    { label: 'Category 18', id: 'category18' },
    { label: 'Category 19', id: 'category19' },
    { label: 'Category 20', id: 'category20' },
]

const ShopForm = () => {
    const [image, setImage] = useState<string | null>(null);
    const [showPermissionFailedModal, setShowPermissionFailedModal] = useState<boolean>(false);
    const [shopName, setShopName] = useState<string>('');
    const [shopDescription, setShopDescription] = useState<string>('');
    const [marketSelected, setMarketSelected] = useState<string>('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const handleSelectCategories = (id: string) => {
        if (selectedCategories.includes(id)) {
            setSelectedCategories(selectedCategories.filter((cat) => cat !== id))
        } else {
            setSelectedCategories([...selectedCategories, id])
        }
    }

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            setShowPermissionFailedModal(true);
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            allowsMultipleSelection: false,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const removeImage = () => {
        setImage(null);
    };

    return (
        <>
            <View className='flex-1'>
                <SetupHeader title='Set up your shop' subHeader='Tell buyers who you are and what you sell.' />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className='flex-1 px-8 mt-4'
                >
                    <View className='flex-row gap-3 items-center mb-6'>
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
                                        <View className='absolute inset-0 bg-black/30 items-center justify-center'>
                                            <Pressable
                                                onPress={removeImage}
                                                className='bg-white/20 p-2 rounded-full backdrop-blur-md'
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

                    <View className='mb-1'>
                        <CustomInput
                            label='Shop name'
                            placeholder='Enter the name of your shop'
                            value={shopName}
                            setValue={setShopName}
                        />
                    </View>

                    <View className='mb-2'>
                        <CustomInput
                            label='Description'
                            placeholder='What do you sell? What makes your shop special?'
                            value={shopDescription}
                            setValue={(value) => {
                                if (value.length <= 1000) {
                                    setShopDescription(value)
                                }
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
                                if ('id' in item) setMarketSelected(String(item.id))
                                else if ('value' in item) setMarketSelected(String(item.value))
                            }}
                        />
                    </View>

                    <View>
                        <Text className={`font-normal font-Inter ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>Categories (Select up to 3)</Text>

                        <View className='flex-row gap-3 flex-wrap w-full pb-4 mt-3'>
                            {
                                categories.map((cat) => (
                                    <Pressable key={cat.id} onPress={() => handleSelectCategories(cat.id)}>
                                        <Text
                                            className={`px-3 py-1.5 rounded-lg ${Platform.OS === 'ios' ? 'text-xs' : 'text-sm'} ${selectedCategories.includes(cat.id) ? 'text-white bg-primary' : 'text-secondary bg-light'}`}
                                            style={{ includeFontPadding: false }}
                                        >
                                            {cat.label}
                                        </Text>
                                    </Pressable>
                                ))
                            }
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>

            <AppModal
                isVisible={showPermissionFailedModal}
                onClose={() => setShowPermissionFailedModal(false)}
                title="Permission Denied"
            >
                <View>
                    <Text className={`text-body text-base font-normal ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} mb-6`}>
                        We need access to your gallery to upload your shop image. Please enable it in your device settings to continue.
                    </Text>
                    <CustomButton
                        buttonText="Okay"
                        onPressHandler={() => setShowPermissionFailedModal(false)}
                    />
                </View>
            </AppModal>
        </>
    )
}

export default ShopForm
