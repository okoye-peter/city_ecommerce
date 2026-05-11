import { View, Text, Platform, Pressable } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Octicons from '@expo/vector-icons/Octicons';
import Feather from '@expo/vector-icons/Feather';
import { BankAccount } from '@/src/types';
import { Link } from 'expo-router';
import { useDeleteBankAccounts } from '../queries';
import { useCallback, useState } from 'react';
import Toast from 'react-native-toast-message';
import { isAxiosError } from 'axios';
import LoadingOverlay from '@/src/components/ui/LoadingOverlay';
import AppModal from '@/src/components/ui/AppModal';
import CustomButton from '@/src/components/ui/CustomButton';


interface Props {
    bankAccount: BankAccount,
    isSelected: boolean,
    onSelect: (bankAccountId: string) => void;
}


const BankCard = ({ bankAccount, isSelected, onSelect }: Props) => {

    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { mutateAsync: deleteBankAccount } = useDeleteBankAccounts();

    const handleDelete = useCallback(async () => {
        setShowDeleteModal(false);
        try {
            setIsDeleting(true);
            await deleteBankAccount(bankAccount.id);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Bank account deleted successfully',
                swipeable: true,
            })
        } catch (error) {
            console.log('error', error)
            const message = isAxiosError(error) ? error?.response?.data?.message : 'Operation failed. Please try again.'
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: message,
                swipeable: true,
            })
        } finally {
            setIsDeleting(false)
        }
    }, [bankAccount.id, deleteBankAccount])

    return (
        <>
            <LoadingOverlay isVisible={isDeleting} />
            <Pressable onPress={() => onSelect(bankAccount.id)} className=''>
                <View className='flex-row items-center gap-3 pb-3 border-b border-border/60'>
                    <View className='items-center justify-center p-3 rounded-full bg-light'>
                        <FontAwesome name="university" size={16} color="#757575" />
                    </View>

                    <View className='flex-1'>
                        <Text numberOfLines={1} className={`font-medium text-primary ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>{bankAccount.bank?.name}</Text>
                        <Text numberOfLines={1} className={`font-medium text-secondary ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>{bankAccount.accountNumber.replace(/.(?=.{4})/g, '*')}</Text>
                    </View>

                    { isSelected && <Feather name="check-circle" size={20} color="black" />}
                </View>
                <View className='flex-row items-center justify-end gap-4 mt-3'>
                    {/* edit bank */}
                    <Link asChild href={{
                        pathname: '/Banks/AddOrEditBankScreen',
                        params: { bankAccount: JSON.stringify(bankAccount) }
                    }}>
                        <Pressable className='p-1'>
                            <Feather name="edit-3" size={20} color="#757575" />
                        </Pressable>
                    </Link>
                    <Pressable className='p-1' onPress={() => setShowDeleteModal(true)}>
                        <Feather name="trash-2" size={20} color="#757575" />
                    </Pressable>
                </View>
            </Pressable>

            <AppModal 
                isVisible={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title='Delete Bank Account'
            >
                <View className='flex-row items-center gap-3 pb-3 border-b border-border/60'>
                    <View className='items-center justify-center p-3 rounded-full bg-light'>
                        <FontAwesome name="university" size={16} color="#757575" />
                    </View>
                    <View className='flex-1'>
                        <Text numberOfLines={1} className={`font-medium text-primary ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>{bankAccount.bank?.name}</Text>
                        <Text numberOfLines={1} className={`font-medium text-secondary ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>{bankAccount.accountNumber.replace(/.(?=.{4})/g, '*')}</Text>
                    </View>
                </View>

                {/* actions buttons */}
                <View className='flex-row items-center  gap-4 mt-6'>
                    
                    <CustomButton  
                        buttonText='Cancel'
                        classStyle='flex-1 !bg-light  border border-border'
                        textClassStyle='!text-body'
                        onPressHandler={() => setShowDeleteModal(false)}

                    />
                    <CustomButton  
                        buttonText='Delete'
                        classStyle='flex-1 !bg-red-600'
                        textClassStyle='!text-light'
                        onPressHandler={handleDelete}
                    />
                </View>
            </AppModal>

        </>
    )
}

export default BankCard
