import { Pressable, Text, View, ScrollView, Platform, KeyboardAvoidingView } from "react-native"
import React, { useState } from "react"
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

cssInterop(LinearGradient, {
    className: "style",
})

export default function EditStoreDetailsScreen() {
    const router = useRouter()

    const [shopName, setShopName] = useState("Amaka's Fabrics")
    const [description, setDescription] = useState("Premium Ankara, lace, and ready-to-wear. Direct from the best fabric merchants in Balogun Market.")
    const [selectedCategories, setSelectedCategories] = useState<string[]>(["fabrics", "fashion", "accessories"])
    
    // Opening Hours State
    const [isHoursModalVisible, setIsHoursModalVisible] = useState(false)
    const [openingTime, setOpeningTime] = useState(new Date(2024, 0, 1, 9, 0))
    const [closingTime, setClosingTime] = useState(new Date(2024, 0, 1, 17, 30))
    const [showOpeningPicker, setShowOpeningPicker] = useState(false)
    const [showClosingPicker, setShowClosingPicker] = useState(false)
    const [openDays, setOpenDays] = useState({
        Monday: true,
        Tuesday: true,
        Wednesday: true,
        Thursday: true,
        Friday: true,
        Saturday: true,
        Sunday: true,
    })

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
                <ScrollView 
                    className="flex-1" 
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
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
                    <View className="bg-white -mt-8 rounded-t-[32px] px-6 pt-6 pb-8">
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
                        buttonText="Save changes"
                        onPressHandler={handleSave}
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
                        <View className="space-y-6 pt-2">
                            {/* Days Selection */}
                            <View className="space-y-3">
                                <Text className="text-muted-foreground font-inter-medium text-sm">Days open</Text>
                                <View className="bg-gray-50/80 rounded-3xl p-1.5 border border-gray-100">
                                    {daysOfWeek.map((day) => (
                                        <View key={day} className="flex-row justify-between items-center py-2 px-4 border-b border-gray-100/50 last:border-0">
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
                                    <Text className="text-muted-foreground font-inter-medium text-xs px-1 uppercase tracking-wider">Opens at</Text>
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
                                    <Text className="text-muted-foreground font-inter-medium text-xs px-1 uppercase tracking-wider">Closes at</Text>
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
                                <View className="items-center justify-center py-6 bg-gray-50/50 rounded-3xl mt-4 border border-gray-100/50">
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
                                            className="mt-4 py-3 px-10 bg-primary rounded-2xl shadow-sm"
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

            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
