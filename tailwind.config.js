/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: {
            DEFAULT: '#2E7D32',
            dark: '#1B5E20',
            light: '#4CAF7D',
            lighter: '#81C784',
            subtle: '#E8F5E9',
          },
          blue: {
            DEFAULT: '#42A5F5',
            dark: '#1976D2',
            light: '#90CAF9',
            lighter: '#B3E5FC',
            subtle: '#E1F5FE',
          },
          bg: '#F1F8F9',
          surface: '#FFFFFF',
          text: {
            primary: '#0F2942',
            secondary: '#5A7184',
            muted: '#8CA0B3',
          },
          border: '#D9E9F0',
          warning: '#F59E0B',
          orange: '#FF9800',
          danger: '#EF4444',
          success: '#10B981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(46, 125, 50, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px rgba(0,0,0,0.05), 0 10px 25px -5px rgba(66, 165, 245, 0.07)',
        'elevated': '0 12px 30px -4px rgba(46, 125, 50, 0.12), 0 4px 10px -2px rgba(0,0,0,0.04)',
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '18px',
        '3xl': '24px',
      }
    },
  },
  plugins: [],
}
