import { View, Text, StyleSheet, Platform, Animated, PanResponder, Dimensions } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { clsx } from 'clsx';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/ui/CustomButton';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SLIDE_INTERVAL = 4000;
const SWIPE_THRESHOLD = 50;

const slider = [
    {
        header: 'Shop smarter with City Commerce.',
        body: 'Find trusted sellers, great deals, and products you actually need. All in one place.',
        image: require('@/assets/images/home_1.jpg')
    },
    {
        header: 'Pick the things that matter most to you.',
        body: 'Groceries, fashion, electronics, or home essentials — choose from categories Nigerians shop every day',
        image: require('@/assets/images/home_2.jpg')
    },
    {
        header: 'Pay safely whether you use cards, or transfers.',
        body: 'We ensure your payments are secure, so you can shop without worry.',
        image: require('@/assets/images/home_3.jpg')
    },
    {
        header: 'Get your orders delivered quickly and reliably.',
        body: 'From groceries to gadgets, enjoy delivery you can count on. Track your package easily and know exactly when it will arrive.',
        image: require('@/assets/images/home_4.jpg')
    },
]

const HomeScreen = () => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);

    const activeIndexRef = useRef(0);
    const isAnimatingRef = useRef(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const imageOpacities = useRef(slider.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))).current;
    const textOpacity = useRef(new Animated.Value(1)).current;
    const textTranslateX = useRef(new Animated.Value(0)).current;

    const goToSlide = (newIndex: number, direction: 'next' | 'prev') => {
        if (isAnimatingRef.current) return;
        isAnimatingRef.current = true;

        const current = activeIndexRef.current;

        // Slide text out
        Animated.parallel([
            Animated.timing(textOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
            Animated.timing(textTranslateX, { toValue: direction === 'next' ? -40 : 40, duration: 200, useNativeDriver: true }),
        ]).start(() => {
            activeIndexRef.current = newIndex;
            setActiveIndex(newIndex);

            // Cross-fade images
            Animated.parallel([
                Animated.timing(imageOpacities[current], { toValue: 0, duration: 600, useNativeDriver: true }),
                Animated.timing(imageOpacities[newIndex], { toValue: 1, duration: 600, useNativeDriver: true }),
            ]).start(() => { isAnimatingRef.current = false; });

            // Slide text in from opposite side
            textTranslateX.setValue(direction === 'next' ? 40 : -40);
            Animated.parallel([
                Animated.timing(textOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.timing(textTranslateX, { toValue: 0, duration: 300, useNativeDriver: true }),
            ]).start();
        });
    };

    const goToSlideRef = useRef(goToSlide);
    goToSlideRef.current = goToSlide;

    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            const next = (activeIndexRef.current + 1) % slider.length;
            goToSlideRef.current(next, 'next');
        }, SLIDE_INTERVAL);
    };

    const startTimerRef = useRef(startTimer);
    startTimerRef.current = startTimer;

    useEffect(() => {
        startTimerRef.current();
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, []);

    const panResponder = useRef(PanResponder.create({
        onMoveShouldSetPanResponder: (_, { dx, dy }) => Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10,
        onPanResponderRelease: (_, { dx }) => {
            if (dx < -SWIPE_THRESHOLD) {
                const next = (activeIndexRef.current + 1) % slider.length;
                goToSlideRef.current(next, 'next');
            } else if (dx > SWIPE_THRESHOLD) {
                const prev = (activeIndexRef.current - 1 + slider.length) % slider.length;
                goToSlideRef.current(prev, 'prev');
            }
            startTimerRef.current();
        },
    })).current;

    return (
        <>
            <StatusBar style="dark" animated />
            <View className='flex-1'>
                <View className="w-full h-[65%]" {...panResponder.panHandlers}>
                    {slider.map((item, index) => (
                        <Animated.View
                            key={`image_${index}`}
                            style={[StyleSheet.absoluteFill, { opacity: imageOpacities[index] }]}
                        >
                            <Image
                                source={item.image}
                                style={{ width: '100%', height: '100%' }}
                                contentFit="fill"
                            />
                        </Animated.View>
                    ))}
                </View>

                <View
                    className="absolute bottom-0 left-0 right-0 px-6 bg-white pt-14"
                    style={[styles.bottomContentWrapper, { top: SCREEN_HEIGHT * 0.65 - 20, paddingBottom: insets.bottom + 16 }]}
                >
                    <Animated.View style={{ opacity: textOpacity, transform: [{ translateX: textTranslateX }] }}>
                        <Text className={clsx('font-Inter-SemiBold text-primary mb-4', Platform.OS === 'ios' && 'text-2xl', Platform.OS === 'android' && 'text-3xl')}>
                            {slider[activeIndex].header}
                        </Text>
                        <Text className={clsx('font-Inter', Platform.OS === 'ios' && 'text-sm', Platform.OS === 'android' && 'text-base')}>
                            {slider[activeIndex].body}
                        </Text>
                    </Animated.View>

                    {/* indicators */}
                    <View className='flex-row gap-1 my-6'>
                        {slider.map((_, index) => (
                            <View
                                key={`indicator_${index}`}
                                className={clsx('w-10 p-1 rounded-full', index === activeIndex ? 'bg-primary' : 'bg-light')}
                            />
                        ))}
                    </View>

                    <CustomButton
                        buttonText='Start Shopping!'
                        onPressHandler={() => router.push('/(guest)/SignInScreen')}
                    />
                </View>
            </View>
        </>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    bottomContentWrapper: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    }
});
