import { View, Text, Platform, Pressable } from 'react-native';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import SetupHeader from './SetupHeader';
import Feather from '@expo/vector-icons/Feather';
import BottomSheetDropdown from '@/src/components/ui/BottomSheetDropdown';
import CustomInput from '@/src/components/ui/CustomInput';
import { useGetBanks } from '@/src/hooks/useBank';

interface BankFormErrors {
    bank?: string;
    accountNumber?: string;
}

import type { BankFormData, BankFormHandle } from '@/src/types';

export type { BankFormData, BankFormHandle } from '@/src/types';

const BankForm = forwardRef<BankFormHandle, object>(
    (_, ref) => {
        const [bank, setBank] = useState('');
        const [accountNumber, setAccountNumber] = useState('');
        const [errors, setErrors] = useState<BankFormErrors>({});

        const { banks, loading: bankIsLoading, error: BankError, refetch: refetchBanks } = useGetBanks();
        const mappedBank = (!bankIsLoading && !BankError ? banks : []).map(b => ({ label: b.name, id: b.id.toString() }));

        useImperativeHandle(ref, () => ({
            validate() {
                const newErrors: BankFormErrors = {};
                if (!bank) newErrors.bank = 'Please select a bank';
                if (!accountNumber.trim()) {
                    newErrors.accountNumber = 'Account number is required';
                } else if (accountNumber.replace(/\D/g, '').length !== 10) {
                    newErrors.accountNumber = 'Account number must be 10 digits';
                }
                setErrors(newErrors);
                return Object.keys(newErrors).length === 0;
            },
            getData() {
                return { bank, accountNumber: accountNumber.replace(/\D/g, '') };
            },
        }));

        return (
            <View>
                <SetupHeader
                    title="Bank details"
                    subHeader="Where should we send your earnings? You can update this anytime."
                />
                <View className="px-8 pt-4">
                    <View className="flex-row items-start flex-1 gap-2 p-3 mb-8 rounded-lg bg-light">
                        <Feather name="info" size={16} color="text-body" />
                        <View className="flex-1">
                            <Text className={`text-secondary font-inter ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>
                                Your account name must match either your registered business name
                                or the name you used to verify your City Commerce account.
                            </Text>
                        </View>
                    </View>

                    {BankError && (
                        <View className='flex-row items-center justify-between px-1 py-3 mb-1 border border-red-200 bg-red-50 rounded-xl'>
                            <Text className='flex-1 ml-3 text-sm text-red-600'>Failed to load banks.</Text>
                            <Pressable onPress={refetchBanks}>
                                <Text className='mr-3 text-sm font-semibold text-red-600'>Retry</Text>
                            </Pressable>
                        </View>
                    )}

                    <BottomSheetDropdown
                        data={mappedBank}
                        value={bank}
                        onChange={(item) => {
                            if ('id' in item) setBank(item.id as string);
                            else if ('value' in item) setBank(String(item.value));
                            if (errors.bank) setErrors(prev => ({ ...prev, bank: undefined }));
                        }}
                        label="Bank"
                        placeholder="Select Bank"
                        searchable={true}
                    />
                    {errors.bank && (
                        <Text style={{ color: '#EF4444', fontSize: 12, marginTop: -12, marginBottom: 8 }}>{errors.bank}</Text>
                    )}

                    <CustomInput
                        label="Account number"
                        placeholder="Enter account number"
                        value={accountNumber}
                        setValue={(v) => {
                            setAccountNumber(v);
                            if (errors.accountNumber) setErrors(prev => ({ ...prev, accountNumber: undefined }));
                        }}
                        keyboardType='numeric'
                        error={errors.accountNumber}
                    />
                </View>
            </View>
        );
    }
);

BankForm.displayName = 'BankForm';

export default BankForm;
