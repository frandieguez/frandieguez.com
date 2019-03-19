import React from "react"
import { StaticQuery, graphql, Link } from "gatsby"
import Image from "gatsby-image"
import Menu from "./menu"

import layoutStyles from "../styles/layout.module.scss"

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header
    let HeaderContent = (
      <StaticQuery
        query={SiteQuery}
        render={data => {
          return (
            <Link to={`/`}>
              <Image
                fixed={data.siteLogo.childImageSharp.fixed}
                alt={title}
              />
            </Link>
          )
        }
      }
      />
    )

    if (location.pathname === rootPath) {
      header = (
        <h1 className={layoutStyles.siteTitle}>
          {HeaderContent}
        </h1>
      )
    } else {
      header = (
        <h3 className={layoutStyles.siteTitle}>
          {HeaderContent}
        </h3>
      )
    }
    return (
      <div className={layoutStyles.pageWrapper}>

        <header className={` ${layoutStyles.Header} ${layoutStyles.wrapper}`}>

          {header}

          <Menu />
        </header>


        <div className={layoutStyles.wrapper} role="main">
          <main>{children}</main>
          <footer className={layoutStyles.Footer}>
            © {new Date().getFullYear()}, Web app designed and coded
            by <strong>Fran Dieguez</strong> using <a href="https://www.gatsbyjs.org">Gatsby</a>

            {/* <ul id="menu-social" class="social-nav-anchors">
              <li id="menu-item-1367" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-1367"><a title="Fran’s Twitter profile" href="http://twitter.com/frandieguez"><span>T</span></a></li>
              <li id="menu-item-1368" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-1368"><a title="Fran’s Facebook profile" href="http://facebook.com/frandieguez"><span>F</span></a></li>
              <li id="menu-item-1369" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-1369"><a title="Fran’s Instagram profile" href="http://instagram.com/fdieguez"><span>I</span></a></li>
              <li id="menu-item-1370" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-1370"><a title="Fran’s Github profile" href="http://github.com/frandieguez"><span>g</span></a></li>
              <li id="menu-item-1371" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-1371"><a title="Fran’s Google+ profile" href="https://plus.google.com/111118036112614969771/about"><span>G</span></a></li>
            </ul> */}
          </footer>
        </div>
      </div>
    )
  }
}

const SiteQuery = graphql`
  query StaticQuery {
    siteLogo: file(absolutePath: { regex: "/logos/glasses.png/" }) {
      childImageSharp {
        fixed(width: 375, height: 71) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`
export default Layout
