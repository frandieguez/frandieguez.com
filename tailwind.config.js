/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-color-cream': 'hsl(23, 100%, 95.5%)',
        'brand-color-grape': 'hsl(249, 32%, 51%)',
        'brand-color-peach': 'hsl(7, 100%, 81%)',
      },
      keyframes: {
        amoeba: {
          '0%': {
            borderRadius: '50%',
            transform: 'scale(1)',
            // backgroundColor:
            //   'color-mix(in srgb, hsl(23, 100%, 95.5%), transparent 50%)',
          },
          '50%': {
            borderRadius: '40% 60% 60% 40% / 50% 30% 70% 50%',
            transform: 'scale(1.1)',
            // backgroundColor:
            //   'color-mix(in srgb, hsl(249, 32%, 51%), transparent 50%)',
          },
          '80%': {
            borderRadius: '60% 40% 40% 60% / 30% 50% 50% 70%',
            transform: 'scale(1)',
            // backgroundColor:
            //   'color-mix(in srgb, hsl(7, 100%, 81%), transparent 50%)',
          },
          '100%': {
            borderRadius: '50%',
            transform: 'scale(1)',
            // backgroundColor:
            //   'color-mix(in srgb, hsl(23, 100%, 95.5%), transparent 50%)',
          },
        },
      },
      animation: {
        'background-rotate': 'backgroundColor 5s infinite',
        amoeba: 'amoeba 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
