import React, { useEffect, useState } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingViewProps,
  Platform,
  StyleProp,
  ViewStyle
} from 'react-native';
const CustomKeyboardAvoidingView = ({
  children,
  style,
  offset = 0,
  behavior = 'padding'
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle> | undefined;
  offset?: number;
  behavior?: KeyboardAvoidingViewProps['behavior'];
}) => {
  const [keyboardHeight] = useState(new Animated.Value(0));

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardWillShow = Keyboard.addListener(showEvent, e => {
      Animated.timing(keyboardHeight, {
        duration: e.duration || 200,
        toValue: e.endCoordinates.height - offset + 10,
        useNativeDriver: false
      }).start();
    });

    const keyboardWillHide = Keyboard.addListener(hideEvent, e => {
      Animated.timing(keyboardHeight, {
        duration: e.duration || 200,
        toValue: 0,
        useNativeDriver: false
      }).start();
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [offset]);

  const animatedStyle =
    behavior === 'height'
      ? { height: keyboardHeight }
      : behavior === 'position'
      ? { bottom: keyboardHeight }
      : { paddingBottom: keyboardHeight };

  return (
    <Animated.View
      style={[{ flex: 1, backgroundColor: '#ffffff' }, style, animatedStyle]}
    >
      {children}
    </Animated.View>
  );
};
export default CustomKeyboardAvoidingView;