import React, { useCallback, forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetModalProps, BottomSheetView } from '@gorhom/bottom-sheet';

interface CustomBottomSheetProps extends Omit<BottomSheetModalProps, 'ref' | 'children'> {
    backdropOpacity?: number;
    children: React.ReactNode;
}

const CustomBottomSheet = forwardRef<BottomSheetModal, CustomBottomSheetProps>(({
    children,
    backdropOpacity = 0.5,
    ...rest
}, ref) => {

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                opacity={backdropOpacity}
            />
        ),
        [backdropOpacity]
    );

    return (

        <BottomSheetModal
            ref={ref}
            index={0}
            enableDynamicSizing={false}
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={styles.handleIndicator}
            keyboardBehavior="extend"
            keyboardBlurBehavior="restore"
            android_keyboardInputMode="adjustResize"
            {...rest}
        >
            <BottomSheetView style={styles.sheetContent}>
                {children}
            </BottomSheetView>
        </BottomSheetModal>
    );
});

CustomBottomSheet.displayName = 'CustomBottomSheet';

export default CustomBottomSheet;

const styles = StyleSheet.create({
    handleIndicator: {
        backgroundColor: '#D9D9D9',
        width: 40,
    },
    sheetContent: {
        flex: 1,
    },
});
