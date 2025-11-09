/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#751eb3',
        'background-light': '#f7f6f8',
        'background-dark': '#1a1220',
        'surface-light': '#ffffff',
        'surface-dark': '#1E1E1E',
      },
      fontFamily: {
        'display': ['Inter', 'sans-serif']
      },
      borderRadius: {
        'DEFAULT': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}


