const path = require("path")

module.exports = {
  darkMode: "class",
  presets: [require("@medusajs/ui-preset")],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/modules/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Modern Zen Color Palette
      colors: {
        // Primary backgrounds - warm paper tones
        paper: {
          DEFAULT: '#FAF8F5',  // Off-white / Giấy dó
          warm: '#F5F0E8',     // Beige nhạt
          cream: '#FDF9F3',    // Cream
          dark: '#E8E2D9',     // Darker paper for contrast
        },
        // Text colors
        ink: {
          DEFAULT: '#2C3E50',  // Charcoal - xám than chì
          light: '#5D6D7E',    // Light charcoal
          muted: '#8B9AAB',    // Muted text
          midnight: '#1A2634', // Midnight blue - xanh đen
        },
        // Accent colors - silk inspired
        silk: {
          pearl: '#F8F6F0',    // Ngọc trai
          ivory: '#FFFFF0',    // Ngà voi
          gold: '#D4AF37',     // Gold accent
          rose: '#E8D4D4',     // Soft rose
        },
        // Legacy grey scale
        grey: {
          0: "#FFFFFF",
          5: "#F9FAFB",
          10: "#F3F4F6",
          20: "#E5E7EB",
          30: "#D1D5DB",
          40: "#9CA3AF",
          50: "#6B7280",
          60: "#4B5563",
          70: "#374151",
          80: "#1F2937",
          90: "#111827",
        },
      },
      // Typography - Serif + Sans-serif combination
      fontFamily: {
        // Serif cho tiêu đề - thanh mảnh, bay bướm
        serif: [
          'Playfair Display',
          'Cormorant Garamond',
          'Georgia',
          'serif',
        ],
        // Sans-serif cho body - hiện đại, gãy gọn
        sans: [
          'Be Vietnam Pro',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
        // Display font cho hero
        display: [
          'Cormorant',
          'Playfair Display',
          'serif',
        ],
      },
      // Spacing for editorial layout
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '128': '32rem',
        '144': '36rem',
      },
      // Animation keyframes
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'silk-wave': {
          '0%': { transform: 'translateX(0) translateY(0)' },
          '50%': { transform: 'translateX(-10px) translateY(-5px)' },
          '100%': { transform: 'translateX(0) translateY(0)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        ring: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "accordion-slide-up": {
          "0%": { height: "var(--radix-accordion-content-height)", opacity: "1" },
          "100%": { height: "0", opacity: "0" },
        },
        "accordion-slide-down": {
          "0%": { "min-height": "0", "max-height": "0", opacity: "0" },
          "100%": { "min-height": "var(--radix-accordion-content-height)", "max-height": "none", opacity: "1" },
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'silk-wave': 'silk-wave 8s ease-in-out infinite',
        'fade-up': 'fade-up 0.8s ease-out forwards',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
        'scale-in': 'scale-in 0.4s ease-out forwards',
        ring: "ring 2.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
        "accordion-open": "accordion-slide-down 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards",
        "accordion-close": "accordion-slide-up 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards",
      },
      // Transitions
      transitionProperty: {
        width: "width margin",
        height: "height",
        bg: "background-color",
        display: "display opacity",
        visibility: "visibility",
        padding: "padding-top padding-right padding-bottom padding-left",
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      transitionTimingFunction: {
        'silk': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      // Border radius
      borderRadius: {
        none: "0px",
        soft: "2px",
        base: "4px",
        rounded: "8px",
        large: "16px",
        circle: "9999px",
      },
      // Max width for content
      maxWidth: {
        "8xl": "100rem",
        "prose-wide": "75ch",
      },
      // Screens
      screens: {
        "2xsmall": "320px",
        xsmall: "512px",
        small: "1024px",
        medium: "1280px",
        large: "1440px",
        xlarge: "1680px",
        "2xlarge": "1920px",
      },
      // Font sizes
      fontSize: {
        "3xl": "2rem",
        "4xl": "2.5rem",
        "5xl": "3rem",
        "6xl": "3.75rem",
        "7xl": "4.5rem",
        "8xl": "6rem",
        "9xl": "8rem",
      },
      // Letter spacing
      letterSpacing: {
        'tightest': '-0.05em',
        'extra-wide': '0.2em',
        'widest': '0.3em',
      },
      // Line height
      lineHeight: {
        'tighter': '1.1',
        'relaxed': '1.75',
      },
      // Aspect ratio
      aspectRatio: {
        'portrait': '3/4',
        'landscape': '4/3',
        'editorial': '2/3',
      },
    },
  },
  plugins: [require("tailwindcss-radix")()],
}
