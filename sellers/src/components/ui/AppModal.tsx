import { View, Text, Pressable, Platform } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal';
import AntDesign from '@expo/vector-icons/AntDesign';

interface AppModalProps {
    isVisible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

const AppModal = ({ isVisible, onClose, title, children }: AppModalProps) => {
    return (
        <Modal 
            isVisible={isVisible}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            useNativeDriver
            hideModalContentWhileAnimating
            animationIn="zoomIn"
            animationOut="zoomOut"
        >
            <View className='bg-white px-6 pb-6 py-3 relative rounded-2xl'>
                {/* close modal button */}
                <Pressable onPress={onClose} className='absolute top-4 right-4 z-10'>
                    <AntDesign name="close" size={18} color="#1E1E1E" />
                </Pressable>

                {title && (
                    <Text className={`text-body font-semibold font-Inter ${Platform.OS === 'ios' ? 'text-xl' : 'text-2xl'} mb-4 pr-8`}>
                        {title}
                    </Text>
                )}

                <View>
                    {children}
                </View>
            </View>
        </Modal>
    )
}

export default AppModal
