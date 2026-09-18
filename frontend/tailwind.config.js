/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        surface: "#ffffff",
        "on-surface": "#030302",
        "on-background": "#030302",
        "on-surface-variant": "#555555",
        "surface-container-low": "#f5f5f5",
        "surface-container": "#f5f5f5",
        "surface-container-high": "#ebeae7",
        "surface-container-highest": "#e2e0dc",
        outline: "#d3cec5",
        "outline-variant": "#d3cec5",
        secondary: "#030302",
        "on-secondary": "#ffffff",
        primary: "#030302",
        "on-primary": "#ffffff",
        error: "#ba1a1a",
      },
      borderRadius: {
        DEFAULT: "2px",
        sm: "2px",
        md: "4px",
        lg: "8px",
        full: "9999px"
      },
      spacing: {
        "margin-desktop": "48px",
        "max-width": "1280px",
        unit: "8px",
        "margin-mobile": "16px",
        gutter: "24px",
        "section-y": "96px",
        "section-y-mobile": "56px"
      },
      fontFamily: {
        sans: ["Geist", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        heading: ["Geist", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Geist", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        ui: ["Geist", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
};

