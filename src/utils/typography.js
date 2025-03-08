import Typography from 'typography';

const typography = new Typography({
  googleFonts: [
    {
      name: 'IBM Plex Sans',
      styles: ['200', '400', '400italic', '700', '700italic'],
    },
    {
      name: 'Playfair Display',
      styles: ['400italic', '400', '900'],
    },

    // {
    //   name: 'Dosis',
    //   styles: ['400italic', '400', '900'],
    // },
    {
      name: 'Lexend',
      styles: ['200italic', '200', '300', '400'],
    },
    
  ],
  bodyFontFamily: ['IBM Plex Sans', 'sans-serif'],
  headerFontFamily: ['Lexend', 'sans-serif'],
});

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles();
}

export default typography;
export const rhythm = typography.rhythm;
export const scale = typography.scale;
