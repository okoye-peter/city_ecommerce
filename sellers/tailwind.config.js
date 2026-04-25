/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./utils/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        body: "#1E1E1E",
        primary: "#2C2C2C",
        secondary: "#757575",
        light: "#F5F5F5",
        muted: "#F1F5F9",
        "muted-foreground": "#64748B",
        border: "#D9D9D9",
        "primary-light": "#303030",
        "muted-neutral": "#E8EAEA",
        "black-light": "#101928",
        "gray-accepted": "#344054",
        "light-gray-2": "#F9FAFB",
        "light-gray": "#EAECF0",
        "blue-light": "#B2DDFF",
        "blue-light-2": "#EFF8FF",
        "blue-dark": "#175CD3",
        "indigo-light": "#E0E0FF",
        "indigo-light-2": "#F5F5FF",
        "indigo-dark": "#4338CA",
        "warning-light": "#FEF0C7",
        "warning-light-2": "#FFFAEB",
        "warning-dark": "#DC6803",
        "error-light": "#FEE4E2",
        "error-light-2": "#FEF3F2",
        "error-dark": "#D92D20",
        "success-light": "#D1FADF",
        "success-light-2": "#ECFDF3",
        "success-dark": "#039855",
      }
    },
  },
  plugins: [],
}