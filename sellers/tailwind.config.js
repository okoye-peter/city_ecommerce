/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
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
        "black-light": "#101928"
      }
    },
  },
  plugins: [],
}