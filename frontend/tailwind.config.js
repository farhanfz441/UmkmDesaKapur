/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0F2A5C',
        'navy-light': '#1E3A8A',
        'navy-dark': '#0A1E3D',
        accent: '#1E3A8A',
        secondary: '#475569',
        muted: '#94A3B8',
        'muted-light': '#CBD5E1',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        'surface-hover': '#F1F5F9',
        border: '#E2E8F0',
        'border-dark': '#CBD5E1',
        orange: '#F59E0B',
        purple: '#8B5CF6',
        pink: '#EC4899',
        green: '#10B981',
        'green-dark': '#059669',
        'blue-light': '#0EA5E9',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Poppins"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '10px',
        'card-lg': '14px',
      },
      boxShadow: {
        soft: '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)',
        card: '0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.06)',
        elevated: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)',
        modal: '0 20px 25px -5px rgba(0,0,0,0.12), 0 8px 10px -6px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};
