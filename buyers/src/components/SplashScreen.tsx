import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";

const BRAND_BLUE = "#ffffff";

export default function SplashScreen() {
    const logoScale = useRef(new Animated.Value(0.6)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const textTranslateY = useRef(new Animated.Value(24)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const dotOpacity = [
        useRef(new Animated.Value(0.3)).current,
        useRef(new Animated.Value(0.3)).current,
        useRef(new Animated.Value(0.3)).current,
    ];

    useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    friction: 6,
                    tension: 80,
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(textOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(textTranslateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        // Pulsing dots loader
        const pulseDot = (dot: Animated.Value, delay: number) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dot, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dot, {
                        toValue: 0.3,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ])
            );

        const animations = dotOpacity.map((dot, i) => pulseDot(dot, i * 180));
        animations.forEach((a) => a.start());
        return () => animations.forEach((a) => a.stop());
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.logoWrapper,
                    { opacity: logoOpacity, transform: [{ scale: logoScale }] },
                ]}
            >
                <Image
                    source={require("@/assets/images/icon.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </Animated.View>

            <Animated.View
                style={[
                    styles.textBlock,
                    {
                        opacity: textOpacity,
                        transform: [{ translateY: textTranslateY }],
                    },
                ]}
            >
                <Text style={styles.title}>City Commerce</Text>
                <Text style={styles.subtitle}>Buyers Edition</Text>
            </Animated.View>

            <View style={styles.dotsRow}>
                {dotOpacity.map((opacity, i) => (
                    <Animated.View key={i} style={[styles.dot, { opacity }]} />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
    },
    logoWrapper: {
        marginBottom: 28,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 10,
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 24,
    },
    textBlock: {
        alignItems: "center",
        gap: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#2C2C2C",
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: "500",
        color: "rgba(44,44,44,0.55)",
        letterSpacing: 2,
        textTransform: "uppercase",
    },
    dotsRow: {
        flexDirection: "row",
        gap: 8,
        position: "absolute",
        bottom: 60,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#208AEF",
    },
});
