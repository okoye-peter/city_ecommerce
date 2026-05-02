import { View, Text, Platform, Pressable } from 'react-native'
import React, { useState } from 'react'
import SafeAreaView from '@/src/components/ui/NativeStyledSafeAreaView'
import { ScrollView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import Offline from '@/src/features/home/components/Offline';
import AppModal from '@/src/components/ui/AppModal';
import CustomButton from '@/src/components/ui/CustomButton';
import Online from '@/src/features/home/components/Online';
import PendingOrderBottomSheet from '@/src/components/ui/PendingOrderBottomSheet';

const user = 'Tunde';

const HomeScreen = () => {
    const [tab, setTab] = useState<'online' | 'offline'>('offline');
    const [showGoOnlineConfirmationModal, setShowGoOnlineConfirmationModal] = useState(false);
    const [showGoOfflineConfirmationModal, setShowGoOfflineConfirmationModal] = useState(false);

    const toggleTab = (selectedTab: 'online' | 'offline') => {
        setTab(selectedTab);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return (
        <>
            <SafeAreaView className='flex-1 bg-white'>
                <ScrollView className='pt-4 flex-1' showsVerticalScrollIndicator={false}>
                    <View className={` px-6 pb-2 ${tab === 'online' ? 'border-b-4 border-muted-neutral/60' : ''}`}>
                        <View className='mb-8'>
                            <Text className={`${Platform.OS === 'ios' ? 'text-2xl' : 'text-3xl'} font-bold text-body mb-2`}>
                                Good Morning, {user}
                            </Text>
                            <Text className={`${Platform.OS === 'ios' ? 'text-[15px]' : 'text-base'} font-normal text-secondary leading-6`}>
                                { tab === 'online' ? "Here's what's happening with your shop today." : 'Your shop is currently taking a break.' }
                            </Text>
                        </View>

                        {/* Status Tabs */}
                        <View className='flex-row items-center bg-muted-neutral rounded-full p-1 mb-2 self-start'>
                            <Pressable
                                onPress={() => tab === 'online' ? setShowGoOfflineConfirmationModal(true) : toggleTab('offline')}
                                className={`flex-row items-center rounded-full px-6 py-2 ${tab === 'offline' ? 'bg-white' : ''}`}
                            >
                                <View className={`w-2 h-2 rounded-full mr-2 ${tab === 'offline' ? 'bg-red-500' : 'bg-secondary/40'}`} />
                                <Text className={`text-sm font-semibold ${tab === 'offline' ? 'text-body' : 'text-secondary'}`}>
                                    Offline
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={() => tab === 'offline' ? setShowGoOnlineConfirmationModal(true) : toggleTab('online')}
                                className={`flex-row items-center rounded-full px-6 py-2 ${tab === 'online' ? 'bg-white' : ''}`}
                            >
                                <View className={`w-2 h-2 rounded-full mr-2 ${tab === 'online' ? 'bg-green-500' : 'bg-secondary/40'}`} />
                                <Text className={`text-sm font-semibold ${tab === 'online' ? 'text-body' : 'text-secondary'}`}>
                                    Online
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    {tab === 'online' && (
                        <Online />
                    )}

                    {tab === 'offline' && (
                        <View className='px-6 mb-6 flex-1'>
                            <Offline goOnlineHandler={() => setShowGoOnlineConfirmationModal(true)} />
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>

            {/* go online modal confirmation */}
            <AppModal
                isVisible={showGoOnlineConfirmationModal}
                title='Go online?'
                onClose={() => setShowGoOnlineConfirmationModal(false)}
            >
                <View>
                    <Text className={`text-body mb-6 font-normal font-inter leading-6 ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>Your shop will become active to buyers and you can start receiving new orders immediately.</Text>
                    <CustomButton
                        buttonText='Yes, Go online'
                        classStyle='mb-3'
                        onPressHandler={() => {
                            setShowGoOnlineConfirmationModal(false);
                            setTab('online');
                        }}
                    />
                    <CustomButton
                        buttonText='Cancel'
                        classStyle='mb-2 !bg-[#E3E3E3]'
                        textClassStyle='!text-body'
                        onPressHandler={() => setShowGoOnlineConfirmationModal(false)}
                    />
                </View>
            </AppModal>

            {/* go offline modal confirmation */}
            <AppModal
                isVisible={showGoOfflineConfirmationModal}
                title='Take a break?'
                onClose={() => setShowGoOfflineConfirmationModal(false)}
            >
                <View>
                    <Text className={`text-body mb-6 font-normal font-inter leading-6 ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>Your shop will be inactive to buyers. You won&apos;t receive new orders until you go back online.</Text>
                    <CustomButton
                        buttonText='Yes, Go offline'
                        classStyle='mb-3 !bg-[#C00F0C] !text-white'
                        onPressHandler={() => {
                            setShowGoOfflineConfirmationModal(false);
                            setTab('offline');
                        }}
                    />
                    <CustomButton
                        buttonText='Cancel'
                        classStyle='mb-2 !bg-[#E3E3E3]'
                        textClassStyle='!text-body'
                        onPressHandler={() => setShowGoOfflineConfirmationModal(false)}
                    />
                </View>
            </AppModal>

            <PendingOrderBottomSheet />
        </>
    )
}

export default HomeScreen
