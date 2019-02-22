import Typography from "typography"
import Wordpress2016 from "typography-theme-wordpress-2016"

Wordpress2016.overrideThemeStyles = () => {
  return {
    "a.gatsby-resp-image-link": {
      boxShadow: `none`,
    },
  }
}

delete Wordpress2016.googleFonts

// const typography = new Typography(Wordpress2016)
const typography = new Typography({
  googleFonts: [
    {
      name: 'Lato',
      styles: ['400italic', '700italic'],
    },
    {
      name: 'Crimson Text',
      styles: ['400italic', '400'],
    },
  ],
  bodyFontFamily: ['Crimson Text', 'serif'],
  headerFontFamily: ['Crimson Text', 'serif'],
})

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
