/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cozy: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#ebe0d0',
          300: '#dec7b0',
          400: '#cfa98b',
          500: '#be8c68',
          600: '#ac7353',
          700: '#8e5c43',
          800: '#734b39',
          900: '#5e3f32',
          950: '#342119',
        },
        lavender: {
          light: '#f3e8ff',
          DEFAULT: '#d8b4fe',
          dark: '#a855f7',
        },
        sunset: {
          pink: '#f472b6',
          orange: '#fb923c',
          gold: '#fbbf24',
          night: '#1e1b4b',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        handwritten: ['Caveat', 'Patrick Hand', 'cursive'],
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-gentle': 'pulseGentle 3s ease-in-out infinite',
        'steam': 'steam 3s ease-out infinite',
        'glow': 'glow 2.5s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        steam: {
          '0%': { transform: 'translateY(0) scale(0.8)', opacity: '0' },
          '50%': { opacity: '0.6' },
          '100%': { transform: 'translateY(-20px) scale(1.2)', opacity: '0' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 15px rgba(251, 191, 36, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 30px rgba(251, 191, 36, 0.8))' },
        }
      },
    },
  },
  plugins: [],
}
