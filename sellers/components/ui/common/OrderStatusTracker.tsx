import { View, Text, Platform } from 'react-native'
import React from 'react'
import { StatusType } from '@/utils/statusClass'

interface Step {
    label: string;
    key: StatusType;
}

const STEPS: Step[] = [
    { label: 'Pending', key: 'pending' },
    { label: 'Accepted', key: 'accepted' },
    { label: 'Ready for pickup', key: 'ready_for_pickup' },
    { label: 'Picked up', key: 'picked_up' },
    { label: 'Delivered', key: 'delivered' },
];

const OrderStatusTracker = ({ currentStatus }: { currentStatus: StatusType }) => {
    // Find index of current status to determine which steps are active
    const currentIndex = STEPS.findIndex(step => step.key === currentStatus);

    return (
        <View>
            {STEPS.map((step, index) => {
                const isLast = index === STEPS.length - 1;
                const isActive = index <= currentIndex;

                return (
                    <View key={step.key} className='flex-row gap-x-4 items-start'>
                        {/* icon and line */}
                        <View className='items-center w-4'>
                            <View 
                                className={`h-4 w-4 rounded-full border ${isActive ? 'bg-primary border-primary' : 'bg-transparent border-secondary'}`} 
                            />
                            {!isLast && (
                                <View 
                                    className={`w-[1.5px] h-10 ${isActive ? 'bg-primary' : 'bg-secondary/40'}`} 
                                />
                            )}
                        </View>

                        {/* text content */}
                        <View className='-mt-0.5'>
                            <Text className={`font-Inter ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'} ${isActive ? 'text-body font-medium' : 'text-secondary font-normal'}`}>
                                {step.label}
                            </Text>
                            {/* You could add a timestamp here if needed */}
                            {isActive && index === currentIndex && (
                                <Text className="text-xs text-secondary font-Inter mt-0.5">Current Status</Text>
                            )}
                        </View>
                    </View>
                );
            })}
        </View>
    );
}

export default OrderStatusTracker;
