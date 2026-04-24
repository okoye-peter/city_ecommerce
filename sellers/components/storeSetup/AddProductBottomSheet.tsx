import React, { useMemo, forwardRef, useState, useRef, useImperativeHandle } from 'react';
import {
    Text,
    View,
    Platform,
    Pressable,
    TouchableOpacity,
} from 'react-native';
import {
    BottomSheetModal,
    BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import CustomBottomSheet from '../ui/common/CustomBottomSheet';
import Feather from '@expo/vector-icons/Feather';
import CustomInput from '../ui/common/CustomInput';
import BottomSheetDropdown from '../ui/common/BottomSheetDropdown';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import AntDesign from '@expo/vector-icons/AntDesign';

interface Product {
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
}

const categories = [
    { label: 'Electronics', id: 'electronics' },
    { label: 'Fashion', id: 'fashion' },
    { label: 'Home Decor', id: 'home_decor' },
    { label: 'Beauty', id: 'beauty' },
    { label: 'Food & Groceries', id: 'food' },
]



interface Props {
    onAddProduct: (product: Product) => void;
}

const AddProductBottomSheet = forwardRef<BottomSheetModal, Props>(({ onAddProduct, ...rest }: Props, ref) => {
    const [image, setImage] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<string | null>(null);

    const localRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => localRef.current!);

    const snapPoints = useMemo(() => ['60%', '95%'], []);

    const resetState = () => {
        setName('');
        setPrice('');
        setDescription('');
        setCategory(null);
    }

    const handleImageSelector = async () => {
        if (image) {
            setImage(null);
            return;
        }
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

    const handleClose = () => {
        resetState();
        localRef.current?.dismiss();
    }

    const handleAddProduct = () => {
        onAddProduct({
            name,
            price: parseFloat(price),
            description,
            image: image || '',
            category: category || '',
        });
        handleClose();
        setImage(null);
        setName('');
        setPrice('');
        setDescription('');
        setCategory(null);
    }

    const isFormValid = !!name && !!price && !!category;

    return (
        <CustomBottomSheet
            ref={localRef}
            snapPoints={snapPoints}

        >
            <View className="flex-1 relative">
                <BottomSheetScrollView
                    contentContainerStyle={{ paddingBottom: 24 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Image Area placeholder */}
                    <Pressable onPress={handleImageSelector} className="mb-5 h-52 w-full bg-light items-center justify-center gap-2 relative">
                        {
                            image ?
                                <>
                                    <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} />
                                    <View className='absolute inset-0 items-center justify-center'>
                                        <View className='bg-white/60 rounded-full p-2'>
                                            <AntDesign name="close" size={16} color="var(--color-body)" />
                                        </View>
                                    </View>
                                </>
                                :
                                <>
                                    <Feather name="image" size={24} color="var(--color-body)" />
                                    <Text className={`text-sm text-body ${Platform.OS === 'ios' ? 'font-normal' : 'font-normal'}`}>
                                        Add images or videos
                                    </Text>
                                </>

                        }
                    </Pressable>

                    {/* Form Fields */}
                    <View className="px-4 gap-0.5">
                        <CustomInput
                            label="Name"
                            placeholder="Product name"
                            value={name}
                            setValue={setName}
                            isBottomSheet={true}
                        />

                        <CustomInput
                            label="Price"
                            placeholder="0.00"
                            value={price}
                            setValue={setPrice}
                            keyboardType="numeric"
                            prefix="₦"
                            isBottomSheet={true}
                        />

                        <CustomInput
                            label="Description"
                            placeholder="Brief description..."
                            value={description}
                            setValue={setDescription}
                            numberOfLines={3}
                            isBottomSheet={true}
                        />

                        <BottomSheetDropdown
                            label="Category"
                            placeholder="Select a category"
                            data={categories}
                            value={category}
                            onChange={(item) => {
                                if ('id' in item) setCategory(String(item.id));
                                else if ('value' in item) setCategory(String(item.value));
                            }}
                        />
                    </View>
                </BottomSheetScrollView>

                {/* Sticky footer for Add Product action */}
                <View
                    style={{ paddingBottom: Platform.OS === 'ios' ? 36 : 24 }}
                    className="px-4 pt-3 bg-white border-t border-[#F0F0F0]"
                >
                    <TouchableOpacity
                        onPress={isFormValid ? handleAddProduct : undefined}
                        activeOpacity={isFormValid ? 0.85 : 1}
                        className={`w-full py-4 rounded-full items-center justify-center ${isFormValid ? 'bg-[#1E1E1E]' : 'bg-[#BFBFBF]'
                            }`}
                    >
                        <Text className="text-white text-base font-semibold">
                            Add Product
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </CustomBottomSheet>
    );
});

AddProductBottomSheet.displayName = 'AddProductBottomSheet';

export default AddProductBottomSheet;