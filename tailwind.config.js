/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF71C2',
          light: '#FFCFED',
          dark: '#E82985',
        },
        secondaryBlue: {
          DEFAULT: '#7DB2FF',
          light: '#CFEAFF',
        },
        brandSecondary: '#22C55E',
        bg: {
          primary: '#FFFFFF',
          secondary: '#F6F7F8',
          tertiary: '#E5E7EB',
        },
        text: {
          primary: '#1A1A1A',
          secondary: '#6B7280',
          tertiary: '#9CA3AF',
        },
        border: '#E5E7EB',
      },
      fontFamily: {
        urbanist: ['Urbanist', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'sm': '12px',
        'md': '16px',
        'lg': '20px',
        'xl': '24px',
        'full': '28px',
      }
    },
  },
  plugins: [],
}
