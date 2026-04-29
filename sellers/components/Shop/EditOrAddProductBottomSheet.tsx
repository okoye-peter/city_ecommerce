import { View, Text, Pressable, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import CustomBottomSheet from '../ui/common/CustomBottomSheet'
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import * as ImagePicker from 'expo-image-picker';
import CustomInput from '../ui/common/CustomInput';
import CustomButton from '../ui/common/CustomButton';
import CustomDropdown from '../ui/common/CustomDropdown';
import CustomSwitch from '../ui/common/CustomSwitch';
import Feather from '@expo/vector-icons/Feather';

const snapShots = ['50%', '75%', '95%'];

const categories = [
    { label: 'Category 1', value: 'category1' },
    { label: 'Category 2', value: 'category2' },
    { label: 'Category 3', value: 'category3' },
    { label: 'Category 4', value: 'category4' },
    { label: 'Category 5', value: 'category5' },
    { label: 'Category 6', value: 'category6' },
    { label: 'Category 7', value: 'category7' },
    { label: 'Category 8', value: 'category8' },
    { label: 'Category 9', value: 'category9' },
    { label: 'Category 10', value: 'category10' },
    { label: 'Category 11', value: 'category11' },
    { label: 'Category 12', value: 'category12' },
    { label: 'Category 13', value: 'category13' },
    { label: 'Category 14', value: 'category14' },
    { label: 'Category 15', value: 'category15' },
    { label: 'Category 16', value: 'category16' },
    { label: 'Category 17', value: 'category17' },
    { label: 'Category 18', value: 'category18' },
    { label: 'Category 19', value: 'category19' },
    { label: 'Category 20', value: 'category20' },
]

const stockOptions = [
    { label: 'In Stock', value: true },
    { label: 'Out of Stock', value: false },
];

interface EditProductBottomSheetProps {
    onClose: () => void;
    product?: {
        id: number;
        image: string;
        name: string;
        price: number;
        quantity: number;
        description?: string;
        category?: string;
    };
}

const EditProductBottomSheet = ({ onClose, product }: EditProductBottomSheetProps) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [image, setImage] = useState(product?.image || '');
    const [name, setName] = useState<string>(product?.name || '');
    const [price, setPrice] = useState<string>(product?.price?.toString() || '');
    const [description, setDescription] = useState<string>(product?.description || '');
    const [category, setCategory] = useState<string>(product?.category || '');
    const [isInStock, setIsInStock] = useState<boolean>(product ? product.quantity > 0 : true);
    const toggleSwitch = () => setIsInStock(previousState => !previousState);
    const isEdit = !!product;

    useEffect(() => {
        bottomSheetRef.current?.present();
    }, []);

    const handleImageSelector = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status) {
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
        }
    }

    const handleCloseBottomSheet = () => {
        bottomSheetRef.current?.dismiss()
    }


    return (
        <>
            <CustomBottomSheet
                ref={bottomSheetRef}
                snapPoints={snapShots}
                enablePanDownToClose={true}
                handleComponent={null}
                onDismiss={onClose}
                index={2}
                backgroundStyle={{ borderRadius: 24 }}
            >
                <View className='flex-1 rounded-t-3xl'>
                    <View className='relative h-[280px] w-full overflow-hidden rounded-t-[24] bg-light' >
                        {image ? (
                            <Image
                                source={{ uri: image }}
                                style={{ width: '100%', height: '100%' }}
                                contentFit='cover'
                            />
                        ) : (
                            <></>
                        )}

                        <View className='absolute inset-0 items-center justify-center'>
                            <Pressable
                                onPress={handleImageSelector}
                                className='bg-white/90 px-4 py-2 rounded-full flex-row items-center gap-2 shadow-sm'
                            >
                                <Feather name="camera" size={16} color="#1E1E1E" />
                                <Text className='font-inter-semibold text-primary'>{isEdit || image ? 'Change Image' : 'Add Image'}</Text>
                            </Pressable>
                        </View>

                        {/* close bottom sheet */}
                        <Pressable
                            onPress={handleCloseBottomSheet}
                            className='absolute top-3 right-2 items-center justify-center rounded-full border border-border bg-light w-8 h-8'
                        >
                            <EvilIcons name="close" size={18} color="black" />
                        </Pressable>
                    </View>

                    <View className='space-y-4 px-6 py-4'>
                        <CustomInput
                            value={name}
                            setValue={setName}
                            label='Name'
                            placeholder='Product Name'
                        />

                        <CustomInput
                            value={price}
                            setValue={setPrice}
                            label='Price'
                            placeholder='0.00'
                            keyboardType='numeric'
                            prefix="₦"
                        />

                        <CustomInput
                            label="Description"
                            placeholder="Brief description..."
                            value={description}
                            setValue={setDescription}
                            numberOfLines={4}
                            isBottomSheet={true}
                        />
                        <CustomDropdown
                            data={categories}
                            label='Category'
                            value={category}
                            onChange={setCategory}
                            placeholder="Select a category"
                            searchable={true}
                            dropdownPosition="top"
                        />

                        <View className='flex-row items-center  gap-2 mb-4'>
                            <Text className={`font-inter-medium text-body ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>
                                In Stock
                            </Text>
                             <CustomSwitch
                                value={isInStock}
                                onValueChange={toggleSwitch}
                                activeColor="#1E1E1E"
                            />
                        </View>

                        <CustomButton
                            buttonText={isEdit ? 'Save changes' : 'Add Product'}
                            onPressHandler={() => {}}
                        />
                    </View>
                </View>
            </CustomBottomSheet>
        </>
    )
}

export default EditProductBottomSheet