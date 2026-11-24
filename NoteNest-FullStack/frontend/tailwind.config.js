/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: "#FFF8EE", 100: "#FFF3E2", 200: "#F8E9D2" },
        lav: {
          50: "#F6F3FE", 100: "#ECE6FC", 200: "#DDD3F8", 300: "#C6B7F1",
          400: "#A895E6", 500: "#8B76DB", 600: "#7360C4", 700: "#5B4BA3",
        },
        blush: {
          50: "#FFF1F4", 100: "#FDE3EA", 200: "#FAC9D6", 300: "#F5A9BE",
          400: "#EC86A2", 500: "#DE6489", 600: "#C24C72",
        },
        sky: {
          50: "#F0F7FE", 100: "#DDECFB", 200: "#C2DCF6", 300: "#9CC4EE",
          400: "#6FA6E2", 500: "#4D8BD2", 600: "#3A73B8",
        },
        ink: { DEFAULT: "#2E2745", soft: "#5E5778", mute: "#7D7794" },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ['"DM Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(91,75,163,.06), 0 8px 24px -10px rgba(91,75,163,.16)",
        lift: "0 2px 4px rgba(91,75,163,.08), 0 20px 44px -14px rgba(91,75,163,.30)",
      },
      keyframes: {
        "pop-in": {
          "0%": { opacity: "0", transform: "translateY(10px) scale(.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "toast-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pop-in": "pop-in .22s cubic-bezier(.2,.8,.3,1) both",
        "fade-in": "fade-in .18s ease-out both",
        "toast-in": "toast-in .2s ease-out both",
      },
    },
  },
  plugins: [],
};
