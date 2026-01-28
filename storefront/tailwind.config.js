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
      // ============================================
      // MODERN ZEN COLOR PALETTE - LUXURY AESTHETIC
      // ============================================
      colors: {
        // Primary backgrounds - warm paper tones
        paper: {
          DEFAULT: '#FAF8F5',  // Off-white / Giấy dó
          warm: '#F5F0E8',     // Beige nhạt
          cream: '#FDF9F3',    // Cream
          dark: '#E8E2D9',     // Darker paper for contrast
        },
        // Text colors - ink tones
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
          champagne: '#F7E7CE', // Champagne
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

      // ============================================
      // TYPOGRAPHY - EDITORIAL MAGAZINE FEEL
      // ============================================
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
        // Display font cho hero - dramatic
        display: [
          'Cormorant',
          'Playfair Display',
          'serif',
        ],
      },

      // ============================================
      // SPACING - EDITORIAL RHYTHM
      // ============================================
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
        '192': '48rem',
      },

      // ============================================
      // ANIMATIONS - PREMIUM MOTION
      // ============================================
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
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'scale-up': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
        'reveal-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'reveal-mask': {
          '0%': { clipPath: 'inset(0 100% 0 0)' },
          '100%': { clipPath: 'inset(0 0 0 0)' },
        },
        'ken-burns': {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.1) translate(-2%, -1%)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
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
        'fade-in-up': 'fade-in-up 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'slide-in-right': 'slide-in-right 0.6s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.5s ease-out forwards',
        'scale-up': 'scale-up 0.4s ease-out forwards',
        'reveal-up': 'reveal-up 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'reveal-mask': 'reveal-mask 1.2s cubic-bezier(0.76, 0, 0.24, 1) forwards',
        'ken-burns': 'ken-burns 20s ease-out infinite alternate',
        'marquee': 'marquee 30s linear infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
        ring: "ring 2.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
        "accordion-open": "accordion-slide-down 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards",
        "accordion-close": "accordion-slide-up 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards",
      },

      // ============================================
      // TRANSITIONS - SILK SMOOTH
      // ============================================
      transitionProperty: {
        width: "width margin",
        height: "height",
        bg: "background-color",
        display: "display opacity",
        visibility: "visibility",
        padding: "padding-top padding-right padding-bottom padding-left",
        border: "border-color border-width",
        transform: "transform",
      },
      transitionDuration: {
        '0': '0ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '600': '600ms',
        '800': '800ms',
        '1000': '1000ms',
        '1200': '1200ms',
        '1500': '1500ms',
        '2000': '2000ms',
      },
      transitionTimingFunction: {
        'silk': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'in-out-circ': 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
        'out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDelay: {
        '0': '0ms',
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },

      // ============================================
      // BORDER RADIUS
      // ============================================
      borderRadius: {
        none: "0px",
        soft: "2px",
        base: "4px",
        rounded: "8px",
        large: "16px",
        xl: "24px",
        '2xl': "32px",
        circle: "9999px",
      },

      // ============================================
      // LAYOUT
      // ============================================
      maxWidth: {
        "8xl": "100rem",
        "prose-wide": "75ch",
        "content": "1200px",
        "wide": "1440px",
        "full-bleed": "1920px",
      },
      minHeight: {
        'screen-50': '50vh',
        'screen-75': '75vh',
        'screen-90': '90vh',
      },

      // ============================================
      // SCREENS - RESPONSIVE BREAKPOINTS
      // ============================================
      screens: {
        "2xsmall": "320px",
        xsmall: "512px",
        small: "1024px",
        medium: "1280px",
        large: "1440px",
        xlarge: "1680px",
        "2xlarge": "1920px",
      },

      // ============================================
      // FONT SIZES - LUXURY SCALE
      // ============================================
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
        "xs": ["0.75rem", { lineHeight: "1rem" }],
        "sm": ["0.875rem", { lineHeight: "1.25rem" }],
        "base": ["1rem", { lineHeight: "1.5rem" }],
        "lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "xl": ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["2rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.5rem", { lineHeight: "2.75rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
        "10xl": ["10rem", { lineHeight: "1" }],
        "hero": ["clamp(3rem, 10vw, 8rem)", { lineHeight: "0.9" }],
        "display": ["clamp(4rem, 15vw, 12rem)", { lineHeight: "0.85" }],
      },

      // ============================================
      // LETTER SPACING - EDITORIAL
      // ============================================
      letterSpacing: {
        'tightest': '-0.05em',
        'tighter': '-0.025em',
        'tight': '-0.015em',
        'normal': '0em',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
        'extra-wide': '0.2em',
        'ultra-wide': '0.3em',
        'mega-wide': '0.4em',
      },

      // ============================================
      // LINE HEIGHT
      // ============================================
      lineHeight: {
        'none': '1',
        'tighter': '1.1',
        'tight': '1.2',
        'snug': '1.375',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '1.75',
        'looser': '2',
      },

      // ============================================
      // ASPECT RATIO
      // ============================================
      aspectRatio: {
        'auto': 'auto',
        'square': '1/1',
        'portrait': '3/4',
        'editorial': '2/3',
        'landscape': '4/3',
        'wide': '16/9',
        'cinema': '21/9',
        'golden': '1.618/1',
        'ultrawide': '32/9',
      },

      // ============================================
      // BOX SHADOW - LUXURY ELEVATION
      // ============================================
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 50px -10px rgba(0, 0, 0, 0.1)',
        'luxury': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        'gold': '0 4px 20px rgba(212, 175, 55, 0.3)',
      },

      // ============================================
      // Z-INDEX SCALE
      // ============================================
      zIndex: {
        'behind': '-1',
        'base': '0',
        'raised': '10',
        'dropdown': '20',
        'sticky': '30',
        'overlay': '40',
        'modal': '50',
        'popover': '60',
        'toast': '70',
        'tooltip': '80',
        'cursor': '90',
        'max': '100',
      },

      // ============================================
      // BACKDROP BLUR
      // ============================================
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
    },
  },
  plugins: [require("tailwindcss-radix")()],
}
