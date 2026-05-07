import React, { useMemo, forwardRef, useState, useRef, useImperativeHandle } from 'react';
import {
    Text,
    View,
    Platform,
    Pressable
} from 'react-native';
import {
    BottomSheetModal,
    BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import CustomBottomSheet from '@/src/components/ui/CustomBottomSheet';
import Feather from '@expo/vector-icons/Feather';
import CustomInput from '@/src/components/ui/CustomInput';
import BottomSheetDropdown from '@/src/components/ui/BottomSheetDropdown';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import AntDesign from '@expo/vector-icons/AntDesign';
import CustomButton from '@/src/components/ui/CustomButton';
import { useGetCategories } from '@/src/hooks/useCategory';

interface Product {
    name: string;
    price: number;
    description: string;
    image: string;
    categoryId: string;
}

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

    const { categories, loading: categoryIsLoading, error: categoryError, refetch: refetchCategories } = useGetCategories();

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
            categoryId: category || '',
        });
        handleClose();
        setImage(null);
        setName('');
        setPrice('');
        setDescription('');
        setCategory(null);
    }

    const isFormValid = !!name && !!price && !!category && !!image;

    return (
        <CustomBottomSheet
            ref={localRef}
            snapPoints={snapPoints}
            handleComponent={null}
            index={1}
            backgroundStyle={{ borderRadius: 24 }}
        >
            <View className="relative flex-1">
                <Pressable
                    onPress={() => localRef.current?.dismiss()}
                    className="absolute z-50 p-2 border rounded-full right-4 top-4 bg-light border-border "
                    style={{ elevation: 5 }}
                >
                    <AntDesign name="close" size={14} color="black" />
                </Pressable>
                <BottomSheetScrollView
                    contentContainerStyle={{ paddingBottom: 24 }}
                    showsVerticalScrollIndicator={false}
                >
                    <Pressable onPress={handleImageSelector} className="h-[250px] w-full bg-light items-center justify-center gap-2 relative rounded-t-[24px] overflow-hidden">
                        {
                            image ?
                                <>
                                    <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} />
                                    <Pressable className='absolute inset-0 items-center justify-center' onPress={() => setImage(null)}>
                                        <View className='p-2 rounded-full bg-light'>
                                            <AntDesign name="close" size={16} color="var(--color-body)" />
                                        </View>
                                    </Pressable>
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

                    <View className="px-4 mt-5 gap-0.5">
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
                            numberOfLines={5}
                            isBottomSheet={true}
                        />

                        {categoryError && (
                            <View className='flex-row items-center justify-between px-1 py-3 mb-1 border border-red-200 bg-red-50 rounded-xl'>
                                <Text className='flex-1 ml-3 text-sm text-red-600'>Failed to load categories.</Text>
                                <Pressable onPress={refetchCategories}>
                                    <Text className='mr-3 text-sm font-semibold text-red-600'>Retry</Text>
                                </Pressable>
                            </View>
                        )}

                        <BottomSheetDropdown
                            label="Category"
                            placeholder="Select a category"
                            data={(!categoryError && !categoryIsLoading ? categories : []).map(c => ({ label: c.name, id: c.id }))}
                            value={category}
                            onChange={(item) => {
                                if ('id' in item) setCategory(String(item.id));
                                else if ('value' in item) setCategory(String(item.value));
                            }}
                        />
                    </View>
                </BottomSheetScrollView>

                <View
                    style={{ paddingBottom: Platform.OS === 'ios' ? 36 : 24 }}
                    className="px-4 bg-white"
                >
                    <CustomButton
                        onPressHandler={() => isFormValid ? handleAddProduct() : undefined}
                        disabled={!isFormValid}
                        buttonText='Add Product'
                    />
                </View>
            </View>
        </CustomBottomSheet>
    );
});

AddProductBottomSheet.displayName = 'AddProductBottomSheet';

export default AddProductBottomSheet;
