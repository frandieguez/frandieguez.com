import Typography from "typography"

const typography = new Typography({
  googleFonts: [
    {
      name: 'Lato',
      styles: ['200', '400', '400italic', '700', '700italic'],
    },
    {
      name: 'Crimson Text',
      styles: ['400italic', '400'],
    },
  ],
  bodyFontFamily: ['Crimson Text', 'sans-serif'],
  headerFontFamily: ['Lato', 'sans-serif'],
})

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
