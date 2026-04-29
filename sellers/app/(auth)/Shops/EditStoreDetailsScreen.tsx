import { Pressable, Text, View, ScrollView, Platform, KeyboardAvoidingView } from "react-native"
import React, { useState } from "react"
import SafeAreaView from "@/components/ui/common/NativeStyledSafeAreaView"
import { Image } from "expo-image"
import { Feather, Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { cssInterop } from "nativewind"
import CustomInput from "@/components/ui/common/CustomInput"
import CustomDropdown from "@/components/ui/common/CustomDropdown"
import CustomButton from "@/components/ui/common/CustomButton"

cssInterop(LinearGradient, {
    className: "style",
})

export default function EditStoreDetailsScreen() {
    const router = useRouter()

    const [shopName, setShopName] = useState("Amaka's Fabrics")
    const [description, setDescription] = useState("Premium Ankara, lace, and ready-to-wear. Direct from the best fabric merchants in Balogun Market.")
    const [selectedCategories, setSelectedCategories] = useState(["fabrics", "fashion", "accessories"])

    const categoriesData = [
        { label: "Fabrics", value: "fabrics" },
        { label: "Fashion", value: "fashion" },
        { label: "Accessories", value: "accessories" },
        { label: "Clothing", value: "clothing" },
        { label: "Textiles", value: "textiles" },
    ]

    const handleSave = () => {
        router.back()
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Banner Section */}
                    <View className="h-[350px] overflow-hidden relative bg-gray-200">
                        {/* back button */}
                        <Pressable
                            className="p-3 rounded-full bg-white/80 absolute top-4 left-4 z-50"
                            onPress={() => router.back()}
                        >
                            <Feather name="arrow-left" size={20} color="black" />
                        </Pressable>

                        {/* store banner */}
                        <Image
                            source="https://i.pinimg.com/1200x/fc/91/8a/fc918ad6c979aa2cea78bf3cd39abe2f.jpg"
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
                            <Pressable className="items-center" onPress={() => { }}>
                                <View className="p-3 bg-white/20 rounded-full border border-white/40 mb-2">
                                    <Feather name="image" size={24} color="white" />
                                </View>
                                <Text className="text-white font-medium text-base">Change image</Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Details Form */}
                    <View className="bg-white -mt-8 rounded-t-[32px] px-6 pt-6 pb-8 flex-1">
                        <CustomInput
                            label="Shop name"
                            value={shopName}
                            setValue={setShopName}
                            placeholder="Enter shop name"
                        />

                        <CustomInput
                            label="Description"
                            value={description}
                            setValue={setDescription}
                            placeholder="Describe your store..."
                            numberOfLines={5}
                        />
                        <Text className="text-secondary text-right text-xs">
                            {description.length}/160
                        </Text>

                        <CustomDropdown
                            label="Category"
                            data={categoriesData}
                            value={selectedCategories}
                            onChange={setSelectedCategories}
                            isMulti={true}
                            placeholder="Select categories"
                        />

                        {/* Opening Hours Section */}
                        <View className="pt-6 border-t border-border/50">
                            <Text className={`text-primary font-inter-semibold ${Platform.OS === "ios" ? "text-base" : "text-lg"} mb-2`}>
                                Opening hours
                            </Text>
                            <Pressable
                                className="flex-row justify-between items-center py-2"
                                onPress={() => { }}
                            >
                                <Text className={`text-secondary ${Platform.OS === "ios" ? "text-base" : "text-lg"}`}>
                                    Monday - Sunday <Text className="text-muted-foreground">|</Text> 9:00 am - 5:30 pm
                                </Text>
                                <Feather name="chevron-right" size={20} color="#757575" />
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>

                {/* Footer Action */}
                <View className="p-6 bg-white border-t border-border/10">
                    <CustomButton
                        buttonText="Save changes"
                        onPressHandler={handleSave}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
