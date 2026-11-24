/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#e1e9f3',
          200: '#c3d3e7',
          300: '#95b3d5',
          400: '#618dc0',
          500: '#3d6ea8',
          600: '#2e568c',
          700: '#254471',
          800: '#1c3456',
          900: '#0f2038',
          950: '#0a1526',
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(15, 32, 56, 0.05)',
        'card': '0 4px 20px -2px rgba(15, 32, 56, 0.08)',
        'dropdown': '0 10px 25px -5px rgba(15, 32, 56, 0.12)',
      }
    },
  },
  plugins: [],
}
