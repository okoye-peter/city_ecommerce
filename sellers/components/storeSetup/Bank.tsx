import { View, Text, Platform } from 'react-native';
import React, { useState } from 'react';
import SetupHeader from './SetupHeader';
import Feather from '@expo/vector-icons/Feather';
import BottomSheetDropdown from '../ui/common/BottomSheetDropdown';
import CustomInput from '../ui/common/CustomInput';


const banks = [
    { label: 'Zenith Bank', id: '058' },
    { label: 'GTBank', id: '059' },
    { label: 'Access Bank', id: '060' },
    { label: 'FBN', id: '061' },
    { label: 'UBA', id: '062' },
    { label: 'WEMA', id: '063' },
    { label: 'Polaris', id: '064' },
    { label: 'STERLING', id: '065' },
];

const Bank = () => {
    const [bank, setBank] = useState('');
    const [accountNumber, setAccountNumber] = useState('');

    const onChange = (item) => {
        if ('id' in item) setBank(item.id);
        else if ('value' in item) setBank(item.value);
    };

    return (
        <View>
            <SetupHeader
                title="Bank details"
                subHeader="Where should we send your earnings? You can update this anytime."
            />
            <View className="px-8 pt-4">
                {/* notice */}
                <View className="flex-1 flex-row p-3 rounded-lg bg-light gap-2 items-start mb-8">
                    <Feather name="info" size={16} color="text-body" />
                    <View className="flex-1">
                        <Text
                            className={`text-secondary font-inter ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}
                        >
                            Your account name must match either your registered business name
                            or the name you used to verify your City Commerce account.
                        </Text>
                    </View>
                </View>

                <BottomSheetDropdown
                    data={banks}
                    value={bank}
                    onChange={onChange}
                    label="Bank"
                    placeholder="Select Bank"
                    searchable={true}
                />

                <CustomInput
                    label="Account number"
                    placeholder="Enter account number"
                    value={accountNumber}
                    setValue={setAccountNumber}
                    keyboardType='numeric'
                />
            </View>
        </View>
    );
};

export default Bank;
