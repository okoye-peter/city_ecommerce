/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1E1E1E",
        body: "#2C2C2C",
        light: '#F5F5F5',
        secondary: '#757575',
      },
      fontFamily: {
        Inter: ['Inter_400Regular'],
        'Inter-SemiBold': ['Inter_600SemiBold'],
        'Inter-Bold': ['Inter_700Bold'],
      },
    },
  },
  plugins: [],
};
