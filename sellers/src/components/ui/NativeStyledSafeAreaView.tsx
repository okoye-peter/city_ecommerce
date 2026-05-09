import { cssInterop } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * In NativeWind v4, 'styled' is deprecated.
 * We use 'cssInterop' to enable 'className' support for third-party components.
 */
cssInterop(SafeAreaView, {
    className: "style",
});

export default SafeAreaView;