// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
      extend: {
        colors: {
          primary: '#E63946', // Rouge vif
          secondary: '#D4A373', // Marron pâle/Jaune cassé
          dark: '#1D3557',
          light: '#F1FAEE',
          accent: '#A8DADC'
        },
      },
    },
  plugins: [],
}
