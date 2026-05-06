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
import { selectUser, useAuthStore } from '../../auth/store/authStore';
import { useMutation } from '@tanstack/react-query';
import api from '@/src/lib/axios';
import { ApiResponse } from '../../auth/api';
import LoadingOverlay from '@/src/components/ui/LoadingOverlay';
import Toast from 'react-native-toast-message';
import { redux } from 'zustand/middleware';



const HomeScreen = () => {
    const user = useAuthStore(selectUser);
    const setUser = useAuthStore(s => s.setUser);
    const [tab, setTab] = useState<'online' | 'offline'>(user?.isActive ? 'online' : 'offline');
    const [showGoOnlineConfirmationModal, setShowGoOnlineConfirmationModal] = useState(false);
    const [showGoOfflineConfirmationModal, setShowGoOfflineConfirmationModal] = useState(false);

    const { mutate: toggleStatus, isPending } = useMutation<ApiResponse<null>>({
        mutationFn: async () => {
            const res = await api.patch('/users/account-status');
            Toast.show({
                type: 'success',
                text1: 'Status updated successfully',
                text2: res.data.message,
                swipeable: true
            })
            return res.data;
        },
        onSuccess: () => {
            const prevStatus = user?.isActive as boolean;
            if (user) setUser({ ...user, isActive: !prevStatus });
            setTab(prevStatus ? 'offline' : 'online');
            setShowGoOnlineConfirmationModal(false);
            setShowGoOfflineConfirmationModal(false);
        },
    });

    const toggleTab = (selectedTab: 'online' | 'offline') => {
        setTab(selectedTab);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };


    return (
        <>
            <LoadingOverlay isVisible={isPending} />
            <SafeAreaView className='flex-1 bg-white'>
                <ScrollView className='flex-1 pt-4' showsVerticalScrollIndicator={false}>
                    <View className={` px-6 pb-2 ${tab === 'online' ? 'border-b-4 border-muted-neutral/60' : ''}`}>
                        <View className='mb-8'>
                            <Text className={`${Platform.OS === 'ios' ? 'text-2xl' : 'text-3xl'} font-bold text-body mb-2`}>
                                Good Morning, {user?.firstName}
                            </Text>
                            <Text className={`${Platform.OS === 'ios' ? 'text-[15px]' : 'text-base'} font-normal text-secondary leading-6`}>
                                {tab === 'online' ? "Here's what's happening with your shop today." : 'Your shop is currently taking a break.'}
                            </Text>
                        </View>

                        {/* Status Tabs */}
                        <View className='flex-row items-center self-start p-1 mb-2 rounded-full bg-muted-neutral'>
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
                        <View className='flex-1 px-6 mb-6'>
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
                        onPressHandler={() => {setShowGoOnlineConfirmationModal(false); toggleStatus()}}
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
                        onPressHandler={() => {setShowGoOfflineConfirmationModal(false); toggleStatus()}}
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
