import {
    View,
    Text,
    Pressable,
    Platform,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    StyleSheet,
} from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import CustomInput from '@/src/components/ui/CustomInput'
import CustomButton from '@/src/components/ui/CustomButton'
import CustomDropdown from '@/src/components/ui/CustomDropdown'
import CustomSwitch from '@/src/components/ui/CustomSwitch'
import LoadingOverlay from '@/src/components/ui/LoadingOverlay'
import AppModal from '@/src/components/ui/AppModal'
import Toast from 'react-native-toast-message'
import { deleteFromCloudinary, uploadToCloudinary } from '@/src/lib/cloudinary'
import { createOrUpdateProductScheme } from '../shopSchema'
import { useCreateProduct, useUpdateProduct } from '../queries'
import { useGetCategories } from '@/src/hooks/useCategory'
import { Product } from '@/src/types'

interface ProductError {
    name?: string
    description?: string
    category?: string
    image?: string
}

const preUploadSchema = createOrUpdateProductScheme.omit({ imageUrl: true })
const IMAGE_HEIGHT = 320

const AddOrEditProductScreen = () => {
    const router = useRouter()
    const insets = useSafeAreaInsets()
    const params = useLocalSearchParams<{ product?: string }>()
    const product: Product | undefined = (() => {
        try { return params.product ? JSON.parse(params.product) : undefined } catch { return undefined }
    })()
    const isEdit = !!product

    const [image, setImage] = useState(product?.imageUrl ?? '')
    const [name, setName] = useState(product?.name ?? '')
    const [price, setPrice] = useState(product?.price?.toString() ?? '')
    const [description, setDescription] = useState(product?.description ?? '')
    const [categoryId, setCategoryId] = useState(product?.categoryId ?? '')
    const [isAvailable, setIsAvailable] = useState(product?.isAvailable ?? true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<ProductError>({})
    const [showPermissionFailedModal, setShowPermissionFailedModal] = useState(false)

    const toggleSwitch = useCallback(() => setIsAvailable(prev => !prev), [])

    const { mutateAsync: createProductAsync } = useCreateProduct()
    const { mutateAsync: updateProductAsync } = useUpdateProduct()
    const { categories } = useGetCategories()

    const categoriesData = useMemo(() => 
        (categories || []).map((cat) => ({ label: cat.name, value: cat.id })),
        [categories]
    )

    const launchGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') { setShowPermissionFailedModal(true); return }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
            aspect: [1,1],
            allowsMultipleSelection: false,
        })
        if (!result.canceled) {
            setImage(result.assets[0].uri)
            if (errors.image) setErrors(prev => ({ ...prev, image: undefined }))
        }
    }

    const launchCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        if (status !== 'granted') { setShowPermissionFailedModal(true); return }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
            aspect: [1,1]
        })
        if (!result.canceled) {
            setImage(result.assets[0].uri)
            if (errors.image) setErrors(prev => ({ ...prev, image: undefined }))
        }
    }

    const pickImage = () => {
        Alert.alert('Product Photo', 'Choose how to add your product image', [
            { text: 'Take Photo', onPress: launchCamera },
            { text: 'Choose from Gallery', onPress: launchGallery },
            { text: 'Cancel', style: 'cancel' },
        ])
    }

    const handleSubmit = async () => {
        setErrors({})
        
        const result = preUploadSchema.safeParse({
            name,
            description,
            categoryId: Number(categoryId),
            isAvailable,
            price: Number(price),
        })

        const fieldErrors: ProductError = {}
        if (!result.success) {
            for (const issue of result.error.issues) {
                const key = issue.path[0] as string
                const mappedKey = key === 'categoryId' ? 'category' : key as keyof ProductError
                if (!fieldErrors[mappedKey]) fieldErrors[mappedKey] = issue.message
            }
        }
        if (!image) fieldErrors.image = 'Please add a product image'

        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors)
            return
        }
        setErrors({})
        setIsSubmitting(true)

        let uploadedPublicId: string | null = null
        try {
            let finalImageUrl = product?.imageUrl ?? ''
            if (image !== product?.imageUrl) {
                const { url, publicId } = await uploadToCloudinary(image, 'products')
                finalImageUrl = url
                uploadedPublicId = publicId
            }

            const productData = { ...result.data!, imageUrl: finalImageUrl }

            if (isEdit) {
                await updateProductAsync({ 
                    productId: product.id, 
                    productData 
                })
            } else {
                await createProductAsync(productData)
            }

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: `Product ${isEdit ? 'updated' : 'created'} successfully`,
                swipeable: true,
            })
            router.back()
        } catch (error: any) {
            if (uploadedPublicId) deleteFromCloudinary(uploadedPublicId).catch(() => {})
            const message = error?.response?.data?.message ?? `${isEdit ? 'Update' : 'Create'} failed. Please try again.`
        
            Toast.show({
                type: 'error',
                text1: `Error ${isEdit ? 'updating' : 'creating'} product`,
                text2: message,
                swipeable: true,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <StatusBar style="light" />
            <LoadingOverlay isVisible={isSubmitting} />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 48, backgroundColor: '#fff' }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* ── Full-bleed hero image ── */}
                    <View style={{ height: IMAGE_HEIGHT, backgroundColor: '#E5E7EB' }} className="relative">
                        {image && (
                            <Image
                                source={{ uri: image }}
                                style={StyleSheet.absoluteFill}
                                contentFit='cover'
                                transition={300}
                            />
                        )}

                        <LinearGradient
                            colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.35)']}
                            locations={[0, 0.35, 1]}
                            style={StyleSheet.absoluteFill}
                        />

                        <Pressable
                            onPress={pickImage}
                            style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
                            className="items-center w-fit top-1/3"
                        >
                            <Feather name="camera" size={20} color="white" />
                            <Text style={{ fontSize: 14, fontWeight: '600', color: 'white', marginTop: 4 }}>
                                {image ? 'Change photo' : 'Add product photo'}
                            </Text>
                        </Pressable>

                        {errors.image && !image && (
                            <Text style={{ position: 'absolute', bottom: 12, alignSelf: 'center', color: '#EF4444', fontSize: 12 }}>
                                {errors.image}
                            </Text>
                        )}

                        {/* Back button — floats over image, respects safe area */}
                        <Pressable
                            onPress={() => router.back()}
                            style={({ pressed }) => ({
                                position: 'absolute',
                                top: insets.top + 8,
                                opacity: pressed ? 0.7 : 1,
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                backgroundColor: 'rgba(255,255,255,0.92)',
                                alignItems: 'center',
                                justifyContent: 'center',
                            })}
                            className="w-10 h-10 p-2 border rounded-full border-secondary left-5"
                        >
                            <Feather name="arrow-left" size={18} color="#1E1E1E" />
                        </Pressable>

                        {/* Title — floats over image, bottom-left */}
                        <View style={{ position: 'absolute', bottom: 36, left: 24 }}>
                            <Text style={{ fontSize: Platform.OS === 'ios' ? 24 : 26, fontWeight: '700', color: 'white', letterSpacing: -0.5 }}>
                                {isEdit ? 'Edit Product' : 'New Product'}
                            </Text>
                        </View>
                    </View>

                    {/* ── Form card slides up over image ── */}
                    <View
                        className='px-6 -mt-6 bg-white rounded-t-3xl pt-7'
                    >
                        {/* Product Details */}
                        <Text className='text-[11px] font-semibold text-gray-400 tracking-widest uppercase mb-4'>Product Details</Text>

                        <CustomInput
                            value={name}
                            setValue={setName}
                            label='Product name'
                            placeholder='e.g. Jollof Rice (large)'
                            error={errors.name}
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
                            placeholder="What makes this product special..."
                            value={description}
                            setValue={setDescription}
                            numberOfLines={4}
                            error={errors.description}
                        />

                        <View className='h-px my-5 bg-gray-100' />

                        {/* Category */}
                        <Text className='text-[11px] font-semibold text-gray-400 tracking-widest uppercase mb-4'>Category</Text>

                        <CustomDropdown
                            data={categoriesData}
                            label='Category'
                            value={categoryId}
                            onChange={setCategoryId}
                            placeholder="Select a category"
                            valueField='value'
                            searchable={true}
                            error={errors.category}
                        />

                        <View className='h-px my-5 bg-gray-100' />

                        {/* Availability */}
                        <Text className='text-[11px] font-semibold text-gray-400 tracking-widest uppercase mb-4'>Availability</Text>

                        <View className='flex-row items-center justify-between p-4 mb-1 bg-gray-50 rounded-2xl'>
                            <View className='flex-1 mr-3'>
                                <Text style={{ fontSize: Platform.OS === 'ios' ? 15 : 16, fontWeight: '600', color: '#1E1E1E', marginBottom: 2 }}>
                                    In stock
                                </Text>
                                <Text style={{ fontSize: 12, color: '#6B7280' }}>
                                    {isAvailable ? 'Visible and available to customers' : 'Hidden from customers'}
                                </Text>
                            </View>
                            <CustomSwitch
                                value={isAvailable}
                                onValueChange={toggleSwitch}
                                activeColor="#1E1E1E"
                            />
                        </View>

                        <View style={{ marginTop: 28 }}>
                            <CustomButton
                                buttonText={isEdit ? 'Save changes' : 'Add Product'}
                                onPressHandler={handleSubmit}
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <AppModal
                isVisible={showPermissionFailedModal}
                onClose={() => setShowPermissionFailedModal(false)}
                title="Permission Denied"
            >
                <View>
                    <Text className={`text-body font-normal ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} mb-6`}>
                        We need access to your camera or gallery to upload your product image. Please enable the required permission in your device settings to continue.
                    </Text>
                    <CustomButton
                        buttonText="Okay"
                        onPressHandler={() => setShowPermissionFailedModal(false)}
                    />
                </View>
            </AppModal>
        </View>
    )
}


export default AddOrEditProductScreen
