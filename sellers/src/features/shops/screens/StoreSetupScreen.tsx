import {
    View,
    Text,
    Pressable,
    Platform,
    ScrollView,
    KeyboardAvoidingView,
} from 'react-native';
import React, { useRef, useState } from 'react';
import SafeAreaView from '@/src/components/ui/NativeStyledSafeAreaView';
import Feather from '@expo/vector-icons/Feather';
import ShopForm, {
    ShopFormHandle,
    ShopFormData,
} from '@/src/features/shops/components/ShopForm';
import BankForm, {
    BankFormHandle,
} from '@/src/features/shops/components/BankForm';
import ProductForm, {
    ProductFormHandle,
    ProductItem,
} from '@/src/features/shops/components/ProductForm';
import CustomButton from '@/src/components/ui/CustomButton';
import LoadingOverlay from '@/src/components/ui/LoadingOverlay';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useGetMarkets } from '@/src/hooks/useMarket';
import { useGetCategories } from '@/src/hooks/useCategory';
import { uploadToCloudinary, deleteFromCloudinary } from '@/src/lib/cloudinary';
import { createStore } from '@/src/services/store.service';
import { selectUser, useAuthStore } from '../../auth/store/authStore';
import { isAxiosError } from 'axios';
import Toast from 'react-native-toast-message';

const StoreSetupScreen = () => {
    const user = useAuthStore(selectUser);
    const updateUser = useAuthStore((s) => s.setUser);
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const shopFormRef = useRef<ShopFormHandle>(null);
    const productFormRef = useRef<ProductFormHandle>(null);
    const bankFormRef = useRef<BankFormHandle>(null);

    const [collectedShopData, setCollectedShopData] = useState<ShopFormData | null>(null);
    const [collectedProducts, setCollectedProducts] = useState<ProductItem[]>([]);


    const {
        markets,
        loading: isMarketLoading,
        error: MarketError,
        refetch: refetchMarkets,
    } = useGetMarkets();
    const {
        categories,
        loading: isCategoryLoading,
        error: CategoryError,
        refetch: refetchCategories,
    } = useGetCategories();

    const mappedMarkets =
        !isMarketLoading && !MarketError
            ? markets.map((m) => ({ label: m.name, id: m.id }))
            : [];
    const mappedCategories =
        !isCategoryLoading && !CategoryError
            ? categories.map((c) => ({ label: c.name, id: c.id }))
            : [];

    const handleSubmit = async () => {
        const bankData = bankFormRef.current?.getData();
        if (!collectedShopData || !bankData) return;

        setIsSubmitting(true);
        const uploadedPublicIds: string[] = [];

        try {
            // Upload shop image
            const { url: shopImageUrl, publicId: shopImagePublicId } =
                await uploadToCloudinary(collectedShopData.image!, 'stores');
            uploadedPublicIds.push(shopImagePublicId);

            // Upload all product images in parallel
            const uploadedProducts = await Promise.all(
                collectedProducts.map(async (product) => {
                    const { url, publicId } = await uploadToCloudinary(
                        product.image,
                        'products',
                    );
                    uploadedPublicIds.push(publicId);
                    return {
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        isAvailable: true,
                        categoryId: Number(product.categoryId),
                        imageUrl: url,
                    };
                }),
            );

            // Submit to API
            await createStore({
                name: collectedShopData.shopName,
                imageUrl: shopImageUrl,
                description: collectedShopData.shopDescription || undefined,
                marketId: Number(collectedShopData.marketSelected),
                categoryIds: collectedShopData.selectedCategories.map(Number),
                products: uploadedProducts,
                bank: {
                    bankId: Number(bankData.bank),
                    accountNumber: bankData.accountNumber,
                },
            });

            // update user
            if (user) {
                updateUser({ ...user, storeCount: 1 });
            }

            router.replace('/(auth)/Shops/StoreSetupSuccessScreen');
        } catch (error: unknown) {
            console.log('store set up error', {
                error: isAxiosError(error) ? error.response?.data : error
            })
            await Promise.allSettled(
                uploadedPublicIds.map((id) => deleteFromCloudinary(id)),
            );
            const message = isAxiosError(error)
                ? (error.response?.data?.message ?? 'Something went wrong. Please try again.')
                : 'Something went wrong. Please try again.';
            Toast.show({ type: 'error', text1: 'Setup Failed', text2: message, swipeable: true });
        } finally {
            setIsSubmitting(false);
        }
    };

    const pressHandler = () => {
        const refs = [shopFormRef, productFormRef, bankFormRef];
        const isValid = refs[step - 1].current?.validate();
        if (!isValid) return;

        if (step === 1) {
            setCollectedShopData(shopFormRef.current!.getData());
            setStep(2);
        } else if (step === 2) {
            setCollectedProducts(productFormRef.current!.getData().products);
            setStep(3);
        } else {
            handleSubmit();
        }
    };

    return (
        <>
            <StatusBar style="dark" />

            {/* loading overlay */}
            <LoadingOverlay isVisible={isSubmitting} />

            <SafeAreaView className="flex-1 pt-4 bg-white">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                <ScrollView showsVerticalScrollIndicator={false} className="flex-1" keyboardShouldPersistTaps="handled">
                    <View className="flex-row justify-start w-full px-8 mb-3">
                        <Pressable
                            className={`w-10 h-10 rounded-full bg-light border border-border items-center justify-center ${step < 2 ? 'opacity-30' : 'opacity-100'}`}
                            disabled={step < 2}
                            onPress={() => setStep((prev) => (prev > 1 ? prev - 1 : prev))}
                        >
                            <Feather name="arrow-left" size={20} color="#1E1E1E" />
                        </Pressable>
                    </View>

                    {/* indicators */}
                    <View className="flex-row gap-3 px-8 mt-3">
                        <View className={`flex-1 p-1 rounded-lg bg-primary`}></View>
                        <View
                            className={`flex-1 p-1 rounded-lg ${step >= 2 ? 'bg-primary' : 'bg-light'}`}
                        ></View>
                        <View
                            className={`flex-1 p-1 rounded-lg ${step === 3 ? 'bg-primary' : 'bg-light'}`}
                        ></View>
                    </View>

                    {(MarketError || CategoryError) && (
                        <View className="flex-row items-center justify-between px-4 py-3 mx-8 mt-3 border border-red-200 bg-red-50 rounded-xl">
                            <Text className="flex-1 text-sm text-red-600">
                                {MarketError && CategoryError
                                    ? 'Failed to load markets and categories.'
                                    : MarketError
                                        ? 'Failed to load markets.'
                                        : 'Failed to load categories.'}
                            </Text>
                            <Pressable
                                onPress={() => {
                                    if (MarketError) refetchMarkets();
                                    if (CategoryError) refetchCategories();
                                }}
                            >
                                <Text className="ml-3 text-sm font-semibold text-red-600">
                                    Retry
                                </Text>
                            </Pressable>
                        </View>
                    )}

                    {/* content */}
                    <View className="flex-1">
                        {step === 1 && (
                            <ShopForm
                                ref={shopFormRef}
                                markets={mappedMarkets}
                                categories={mappedCategories}
                            />
                        )}
                        {step === 2 && <ProductForm ref={productFormRef} />}
                        {step === 3 && <BankForm ref={bankFormRef} />}
                    </View>
                </ScrollView>

                <View className="px-10 py-4 bg-white">
                    <CustomButton
                        buttonText={step === 3 ? 'Submit' : 'Continue'}
                        onPressHandler={pressHandler}
                        disabled={isSubmitting}
                    />
                    <Text
                        className={`text-secondary mt-2 text-center ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}
                    >
                        Step {step} of 3 • You can always edit these later
                    </Text>
                </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
};

export default StoreSetupScreen;
