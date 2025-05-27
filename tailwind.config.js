const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FAF7F0',
          light: '#F3E8D2', // Cream
          DEFAULT: '#D4B483', // Warm beige
          dark: '#A07855',   // Earth brown
        },
        secondary: {
          light: '#6E7F80',  // Slate
          DEFAULT: '#3B4B4C', // Dark slate
          dark: '#1E2929',   // Charcoal
          50: '#f5fafa',
          100: '#e0efef',
          200: '#c2e0e0',
          300: '#a3d0d0',
          400: '#84c1c1',
          500: '#66b2b2',
          600: '#4d9999',
          700: '#397777',
          800: '#295b5b', // this enables text-secondary-800
          900: '#1a3f3f',
        },
        accent: {
          DEFAULT: '#C17C74', // Terracotta
          dark: '#8C5E58',    // Deep terracotta
        },
        neutral: colors.stone
      },
      clipPath: {
        roof: 'polygon(0 100%, 50% 0, 100% 100%)',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}