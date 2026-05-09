import { Pressable, Text, View, ScrollView, Platform, KeyboardAvoidingView, Alert } from "react-native"
import React, { useState, useEffect } from "react"
import SafeAreaView from "@/src/components/ui/NativeStyledSafeAreaView"
import { Image } from "expo-image"
import { Feather } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { cssInterop } from "nativewind"
import CustomInput from "@/src/components/ui/CustomInput"
import CustomDropdown from "@/src/components/ui/CustomDropdown"
import CustomButton from "@/src/components/ui/CustomButton"
import AppModal from "@/src/components/ui/AppModal"
import CustomSwitch from "@/src/components/ui/CustomSwitch"
import DateTimePicker from '@react-native-community/datetimepicker'
import { useGetCategories } from "@/src/hooks/useCategory";
import { useGetMarkets } from "@/src/hooks/useMarket";
import { useGetUserStoreSummary, useUpdateStore } from "../../shop/queries";
import BottomSheetDropdown from "@/src/components/ui/BottomSheetDropdown";
import { z } from 'zod';
import { editStoreSchema } from "../editStoreSchema";
import LoadingOverlay from "@/src/components/ui/LoadingOverlay";
import Skeleton from "@/src/components/ui/Skeleton";
import { isAxiosError } from "axios";
import Toast from "react-native-toast-message";
import * as ImagePicker from 'expo-image-picker';
import { deleteFromCloudinary, uploadToCloudinary } from "@/src/lib/cloudinary";

cssInterop(LinearGradient, {
    className: "style",
})


const UPPER_TO_TITLE: Record<string, string> = {
    MONDAY: 'Monday', TUESDAY: 'Tuesday', WEDNESDAY: 'Wednesday',
    THURSDAY: 'Thursday', FRIDAY: 'Friday', SATURDAY: 'Saturday', SUNDAY: 'Sunday',
}

function parseTimeToDate(time: string | null | undefined, defaultHour = 9): Date {
    if (!time) return new Date(2024, 0, 1, defaultHour, 0)
    const [h, m] = time.split(':').map(Number)
    return new Date(2024, 0, 1, h, m)
}

function parseOpenDays(days: string[] | undefined): Record<string, boolean> {
    const base: Record<string, boolean> = {
        Monday: false, Tuesday: false, Wednesday: false,
        Thursday: false, Friday: false, Saturday: false, Sunday: false,
    }
    if (!days?.length) return Object.fromEntries(Object.keys(base).map(k => [k, true]))
    for (const d of days) {
        const key = UPPER_TO_TITLE[d]
        if (key) base[key] = true
    }
    return base
}

function toHHMM(date: Date): string {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

interface StoreError {
    imageUrl?: string;
    name?: string;
    description?: string;
    categories?: string;
    market?: string;
    openDays?: string;
}

export default function EditStoreDetailsScreen() {
    const router = useRouter()

    const { data: store, isLoading: storeIsLoading } = useGetUserStoreSummary();
    const { categories, loading: categoriesIsLoading, error: categoryError, refetch: refetchCategories } = useGetCategories();
    const { markets, loading: marketsIsLoading, error: marketError, refetch: refetchMarkets } = useGetMarkets();

    const storeDetails = store?.store;

    const [errors, setErrors] = useState<StoreError>({});
    
    const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false)

    const [image, setImage] = useState<string | null>(storeDetails?.imageUrl || null);
    const [showPermissionFailedModal, setShowPermissionFailedModal] = useState<boolean>(false);

    const [shopName, setShopName] = useState(storeDetails?.name ?? '')
    const [description, setDescription] = useState(storeDetails?.description ?? "")
    const [selectedCategories, setSelectedCategories] = useState<string[]>(storeDetails?.categories?.map(cat => cat.categoryId) ?? [])
    const [marketSelected, setMarketSelected] = useState<string>(storeDetails?.marketId ?? '');


    // Opening Hours State
    const [isHoursModalVisible, setIsHoursModalVisible] = useState(false)
    const [openingTime, setOpeningTime] = useState(() => parseTimeToDate(storeDetails?.openingTime))
    const [closingTime, setClosingTime] = useState(() => parseTimeToDate(storeDetails?.closingTime, 17))
    const [showOpeningPicker, setShowOpeningPicker] = useState(false)
    const [showClosingPicker, setShowClosingPicker] = useState(false)
    const [openDays, setOpenDays] = useState(() => parseOpenDays(storeDetails?.openDays))

    useEffect(() => {
        if (!storeDetails) return
        setShopName(storeDetails.name ?? '')
        setDescription(storeDetails.description ?? '')
        setMarketSelected(storeDetails.marketId ?? '')
        setSelectedCategories(storeDetails.categories?.map(cat => cat.categoryId) ?? [])
        setImage(storeDetails.imageUrl ?? null)
        setOpeningTime(parseTimeToDate(storeDetails.openingTime))
        setClosingTime(parseTimeToDate(storeDetails.closingTime, 17))
        setOpenDays(parseOpenDays(storeDetails.openDays))
    }, [storeDetails])

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
    type DayName = typeof daysOfWeek[number];

    const toggleDay = (day: DayName) => {
        setOpenDays(prev => ({ ...prev, [day]: !prev[day] }))
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
    }

    const getDisplayDays = () => {
        const activeDays = daysOfWeek.filter(day => openDays[day])
        if (activeDays.length === 0) return "Closed"
        if (activeDays.length === 7) return "Monday - Sunday"

        // Helper to get short name
        const getShort = (day: string) => day.substring(0, 3)

        const ranges: string[] = []
        let startIdx = 0

        while (startIdx < activeDays.length) {
            let endIdx = startIdx

            // Find contiguous range in the original daysOfWeek array
            while (
                endIdx + 1 < activeDays.length &&
                daysOfWeek.indexOf(activeDays[endIdx + 1]) === daysOfWeek.indexOf(activeDays[endIdx]) + 1
            ) {
                endIdx++
            }

            if (startIdx === endIdx) {
                ranges.push(getShort(activeDays[startIdx]))
            } else {
                ranges.push(`${getShort(activeDays[startIdx])} - ${getShort(activeDays[endIdx])}`)
            }

            startIdx = endIdx + 1
        }

        return ranges.join(', ')
    }

    const activeDays = daysOfWeek.filter(day => openDays[day]).map(day => day.toUpperCase())

    const { mutateAsync: update, isPending } = useUpdateStore()

    const categoriesData = categories?.map((cat) => ({ label: cat.name, value: cat.id })) ?? []
    const marketData = markets?.map((market) => ({ label: market.name, value: market.id })) ?? []

    const handleSave = async () => {
        const result = editStoreSchema.safeParse({
            name: shopName,
            description: description ?? '',
            marketId: marketSelected,
            categoryIds: selectedCategories,
            openDays: activeDays,
            openingTime: toHHMM(openingTime),
            closingTime: toHHMM(closingTime),
        })

        if (!result.success) {
            const fieldErrors = z.flattenError(result.error).fieldErrors
            setErrors({
                name: fieldErrors.name?.[0],
                description: fieldErrors.description?.[0],
                categories: fieldErrors.categoryIds?.[0],
                market: fieldErrors.marketId?.[0],
                openDays: fieldErrors.openDays?.[0],
            })
            return
        }

        setErrors({})
        setIsSubmittingUpdate(true);
        const uploadedPublicIds: string[] = [];
        try {
            let finalImageUrl = image ?? '';
            const isNewLocalImage = image && !image.startsWith('http');
            if (isNewLocalImage) {
                const { url: newUploadedShopImageUrl, publicId: shopImagePublicId } =
                    await uploadToCloudinary(image, 'stores');
                uploadedPublicIds.push(shopImagePublicId);
                finalImageUrl = newUploadedShopImageUrl;
            }
            await update({
                name: shopName,
                imageUrl: finalImageUrl,
                description: description ?? '',
                marketId: marketSelected,
                categoryIds: selectedCategories,
                openDays: activeDays as any,
                openingTime: toHHMM(openingTime),
                closingTime: toHHMM(closingTime),
            })
            Toast.show({
                type: 'success',
                text1: 'Store Updated successfully'
            })
            router.back();
        } catch (error) {
            console.log('store set up error', {
                error: isAxiosError(error) ? error.response?.data : error
            })
            await Promise.allSettled(
                uploadedPublicIds.map((id) => deleteFromCloudinary(id)),
            );


            const errMsg = isAxiosError(error) ? error?.response?.data?.message : 'Sorry something went wrong';
            Toast.show({
                type: 'error',
                text1: 'Store update failed',
                text2: errMsg
            })
        } finally {
            setIsSubmittingUpdate(false);
        }
    }

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
            if (errors.imageUrl) setErrors(prev => ({ ...prev, imageUrl: undefined }));
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
            if (errors.imageUrl) setErrors(prev => ({ ...prev, imageUrl: undefined }));
        }
    };

    const pickImage = () => {
        Alert.alert('Upload Shop Image', 'Choose how to add your shop image', [
            { text: 'Take Photo', onPress: launchCamera },
            { text: 'Choose from Gallery', onPress: launchGallery },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    if (storeIsLoading) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Skeleton width="100%" height={350} borderRadius={0} />
                    <View className="bg-white -mt-8 rounded-t-[32px] px-6 pt-6 pb-8 gap-4">
                        <Skeleton width={120} height={14} borderRadius={4} />
                        <Skeleton width="100%" height={48} borderRadius={8} />
                        <Skeleton width={120} height={14} borderRadius={4} />
                        <Skeleton width="100%" height={96} borderRadius={8} />
                        <Skeleton width={120} height={14} borderRadius={4} />
                        <Skeleton width="100%" height={48} borderRadius={8} />
                        <Skeleton width={120} height={14} borderRadius={4} />
                        <Skeleton width="100%" height={48} borderRadius={8} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <LoadingOverlay isVisible={isSubmittingUpdate} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Banner Section */}
                    <View className="h-[350px] overflow-hidden relative bg-gray-200">
                        {/* back button */}
                        <Pressable
                            className="absolute z-50 p-3 rounded-full bg-white/80 top-4 left-4"
                            onPress={() => router.back()}
                        >
                            <Feather name="arrow-left" size={20} color="black" />
                        </Pressable>

                        {/* store banner */}
                        <Image
                            source={{
                                uri: storeDetails?.imageUrl ?? undefined
                            }}
                            style={{ width: "100%", height: 350, backgroundColor: "#E5E7EB" }}
                            contentFit="cover"
                        />

                        {/* gradient overlay */}
                        <LinearGradient
                            colors={["transparent", "rgba(0,0,0,0.6)"]}
                            className="absolute inset-0"
                        />

                        {/* Change Image Overlay */}
                        <View className="absolute inset-0 items-center justify-center">
                            <Pressable className="items-center" onPress={pickImage}>
                                <View className="p-3 mb-2 border rounded-full bg-white/20 border-white/40">
                                    <Feather name="image" size={24} color="white" />
                                </View>
                                <Text className="text-base font-medium text-white">Change image</Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Details Form */}
                    <View className="bg-white -mt-8 rounded-t-[32px] px-6 pt-6 pb-8">
                        <CustomInput
                            label="Shop name"
                            value={shopName}
                            setValue={setShopName}
                            error={errors.name}
                            placeholder="Enter shop name"
                        />

                        <CustomInput
                            label="Description"
                            value={description}
                            setValue={setDescription}
                            error={errors.description}
                            placeholder="Describe your store..."
                            numberOfLines={5}
                        />
                        <Text className="text-xs text-right text-secondary">
                            {description.length}/160
                        </Text>

                        {categoryError && (
                            <Pressable
                                onPress={refetchCategories}
                                className="flex-row items-center p-3 mb-2 border border-red-200 rounded-lg bg-red-50"
                            >
                                <Feather name="alert-circle" size={14} color="#EF4444" />
                                <Text className="flex-1 ml-2 text-xs text-red-600">Failed to load categories</Text>
                                <Text className="text-xs font-medium text-red-600">Retry</Text>
                            </Pressable>
                        )}
                        <CustomDropdown
                            label="Category"
                            data={categoriesData}
                            value={selectedCategories}
                            onChange={setSelectedCategories}
                            error={errors.categories}
                            isMulti={true}
                            valueField="value"
                            placeholder="Select categories"
                        />

                        {/* market */}
                        {marketError && (
                            <Pressable
                                onPress={refetchMarkets}
                                className="flex-row items-center p-3 mb-2 border border-red-200 rounded-lg bg-red-50"
                            >
                                <Feather name="alert-circle" size={14} color="#EF4444" />
                                <Text className="flex-1 ml-2 text-xs text-red-600">Failed to load markets</Text>
                                <Text className="text-xs font-medium text-red-600">Retry</Text>
                            </Pressable>
                        )}
                        <BottomSheetDropdown
                            label='Market'
                            placeholder='Select a market'
                            value={marketSelected}
                            data={marketData}
                            searchable={true}
                            keyField="value"
                            onChange={(item) => {
                                if ('id' in item) setMarketSelected(String(item.id));
                                else if ('value' in item) setMarketSelected(String(item.value));
                                if (errors.market) setErrors(prev => ({ ...prev, market: undefined }));
                            }}
                        />
                        {errors.market && (
                            <Text style={{ color: '#EF4444', fontSize: 12, marginTop: -12, marginBottom: 8 }}>{errors.market}</Text>
                        )}

                        {/* Opening Hours Section */}
                        <View className="pt-6 border-t border-border/50">
                            <Text className={`text-primary font-inter-semibold ${Platform.OS === "ios" ? "text-base" : "text-lg"} mb-2`}>
                                Opening hours
                            </Text>
                            <Pressable
                                className="flex-row items-center justify-between py-2"
                                onPress={() => setIsHoursModalVisible(true)}
                            >
                                <Text className={`text-secondary ${Platform.OS === "ios" ? "text-base" : "text-lg"}`}>
                                    {getDisplayDays()} <Text className="text-muted-foreground">|</Text> {formatTime(openingTime)} - {formatTime(closingTime)}
                                </Text>
                                <Feather name="chevron-right" size={20} color="#757575" />
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>

                {/* Footer Action */}
                <View className="p-6 bg-white border-t border-border/10">
                    <CustomButton
                        buttonText={isPending ? "Saving..." : "Save changes"}
                        onPressHandler={handleSave}
                        disabled={isPending}
                    />
                </View>

                {/* Opening Hours Modal */}
                <AppModal
                    isVisible={isHoursModalVisible}
                    onClose={() => setIsHoursModalVisible(false)}
                    title="Set Opening Hours"
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        className="max-h-[80vh]"
                        contentContainerStyle={{ paddingBottom: 20 }}
                    >
                        <View className="pt-2 space-y-6">
                            {/* Days Selection */}
                            <View className="space-y-3">
                                <Text className="text-sm text-muted-foreground font-inter-medium">Days open</Text>
                                <View className="bg-gray-50/80 rounded-3xl p-1.5 border border-gray-100">
                                    {daysOfWeek.map((day) => (
                                        <View key={day} className="flex-row items-center justify-between px-4 py-2 border-b border-gray-100/50 last:border-0">
                                            <Text className="font-inter text-body">{day}</Text>
                                            <CustomSwitch
                                                value={openDays[day]}
                                                onValueChange={() => toggleDay(day)}
                                            />
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Time Selection Row */}
                            <View className="flex-row gap-3 mt-4">
                                <View className="flex-1 space-y-2">
                                    <Text className="px-1 text-xs tracking-wider uppercase text-muted-foreground font-inter-medium">Opens at</Text>
                                    <Pressable
                                        onPress={() => {
                                            setShowOpeningPicker(true);
                                            setShowClosingPicker(false);
                                        }}
                                        className={`h-14 rounded-2xl border items-center justify-center ${showOpeningPicker ? 'bg-primary/5 border-primary' : 'bg-gray-50 border-gray-100'}`}
                                    >
                                        <Text className={`font-inter-bold text-lg ${showOpeningPicker ? 'text-primary' : 'text-primary'}`}>{formatTime(openingTime)}</Text>
                                    </Pressable>
                                </View>

                                <View className="flex-1 space-y-2">
                                    <Text className="px-1 text-xs tracking-wider uppercase text-muted-foreground font-inter-medium">Closes at</Text>
                                    <Pressable
                                        onPress={() => {
                                            setShowClosingPicker(true);
                                            setShowOpeningPicker(false);
                                        }}
                                        className={`h-14 rounded-2xl border items-center justify-center ${showClosingPicker ? 'bg-primary/5 border-primary' : 'bg-gray-50 border-gray-100'}`}
                                    >
                                        <Text className={`font-inter-bold text-lg ${showClosingPicker ? 'text-primary' : 'text-primary'}`}>{formatTime(closingTime)}</Text>
                                    </Pressable>
                                </View>
                            </View>

                            {/* Centered Pickers */}
                            {(showOpeningPicker || showClosingPicker) && (
                                <View className="items-center justify-center py-6 mt-4 border bg-gray-50/50 rounded-3xl border-gray-100/50">
                                    <DateTimePicker
                                        value={showOpeningPicker ? openingTime : closingTime}
                                        mode="time"
                                        is24Hour={false}
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={(event, selectedDate) => {
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
                                            onPress={() => {
                                                setShowOpeningPicker(false);
                                                setShowClosingPicker(false);
                                            }}
                                            className="px-10 py-3 mt-4 shadow-sm bg-primary rounded-2xl"
                                        >
                                            <Text className="text-white font-inter-semibold">Confirm selection</Text>
                                        </Pressable>
                                    )}
                                </View>
                            )}

                            <View className="pt-6">
                                <CustomButton
                                    buttonText="Done"
                                    onPressHandler={() => setIsHoursModalVisible(false)}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </AppModal>

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

            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
