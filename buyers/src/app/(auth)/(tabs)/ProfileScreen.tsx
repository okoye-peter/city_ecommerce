import { View, Text, Platform, Pressable } from 'react-native'
import React, { useState } from 'react'
// import SafeAreaView from '@/src/components/ui/NativeStyledSafeAreaView'
import { Image } from 'expo-image'
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
// import { selectUser, useAuthStore } from '../../auth/store/authStore';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useLogoutMutation } from '@/store/api/authApi';
import LoadingModal from '@/components/ui/LoadingModal';
import SafeAreaView from '@/components/ui/NativeStyledSafeAreaView';
// import LoadingOverlay from '@/src/components/ui/LoadingOverlay';

const options = [
    {
        icon: <Feather name="user" size={18} color="#757575" />,
        label: 'Profile details'
    },
    {
        icon: <Feather name="shield" size={18} color="#757575" />,
        label: 'Verification'
    },
    {
        icon: <Feather name="credit-card" size={18} color="#757575" />,
        label: 'Bank & payments'
    },
    {
        icon: <Feather name="bell" size={18} color="#757575" />,
        label: 'Notifications'
    },
    {
        icon: <AntDesign name="question-circle" size={18} color="#757575" />,
        label: 'Help & support'
    },
]

const ProfileScreen = () => {
    const router = useRouter()
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [logout, {isLoading: isLoggingOut}] = useLogoutMutation()
    

    const handleSignOut = async () => {
        setIsSigningOut(true)
        await logout();
        Toast.show({
            type: 'success',
            text1: 'Logged out',
            text2: 'You have been successfully logged out.',
            swipeable: true,
        })
        setIsSigningOut(false);
        router.replace('/(guest)/SignInScreen');
    }
    return (
        <>
            <LoadingModal visible={isLoggingOut} />
            <SafeAreaView className='flex-1 bg-white' edges={['top', 'left', 'right']}>
                <View className='items-center pt-10 pb-4 border-b-4 border-primary/5'>
                    <View className='w-24 h-24 overflow-hidden rounded-full'>
                        {
                            user?.avatar ? (
                                <Image
                                    source={{
                                        uri: user.avatar
                                    }}
                                    style={{ width: '100%', height: '100%' }}
                                    contentFit='cover'
                                />)
                                :
                                (<Image
                                    source={require('@/assets/images/user.png')}
                                    style={{ width: '100%', height: '100%' }}
                                    contentFit='cover'
                                />)
                        }
                    </View>
                    <Text className={`font-normal mt-4 capitalize ${Platform.OS === 'ios' ? 'text-lg' : 'text-xl'}`}>{ user?.firstName}{" "}{user?.lastName}</Text>
                </View>
                <View className='flex-1 px-6 py-3'>
                    {
                        options.map((option, index) => (
                            <Pressable key={`option-${index}`} className='flex-row items-center justify-between gap-3 py-4 border-b border-primary/5'>
                                <View className='items-center justify-center p-3 rounded-full bg-light'>
                                    {option.icon}
                                </View>
                                <Text className={`flex-1 font-normal ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>{option.label}</Text>
                                <MaterialIcons name="arrow-forward-ios" size={14} color="#757575" />
                            </Pressable>
                        ))
                    }

                    <Pressable className='flex-row items-center justify-between gap-2 px-3 py-4' onPress={handleSignOut}>
                        <View className='items-center justify-center rounded-full '>
                            <MaterialIcons name="logout" size={18} color="#C00F0C" />
                        </View>
                        <Text className={`flex-1 font-normal text-[#C00F0C] ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>Sign Out</Text>
                    </Pressable>

                    <Text className='mt-6 font-normal text-center text-secondary'>City Commerce OS - v1.0</Text>
                </View>
            </SafeAreaView>
        </>
    )
}

export default ProfileScreen
