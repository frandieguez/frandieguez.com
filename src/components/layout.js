import React from "react"
import { StaticQuery, graphql, Link } from "gatsby"
import Image from "gatsby-image"

import { rhythm } from "../utils/typography"
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
      <div className="page-wrapper">

        <header className={` ${layoutStyles.Header} ${layoutStyles.wrapper}`}>

          {header}

          <section className={layoutStyles.Menu}>
            <ul>
              <li>
                <Link to={'/about'} className={layoutStyles.item}>The author</Link>
              </li>
              <li>
                <Link to={'/archives'} className={layoutStyles.item}>Arquive</Link>
              </li>
              <li>
                <Link to={'/contact'} className={layoutStyles.item}>Contact</Link>
              </li>
            </ul>
          </section>
        </header>

        <div className={layoutStyles.wrapper}>
          <main>{children}</main>
          <footer className={layoutStyles.Footer}>
            © {new Date().getFullYear()}, Web app designed and coded
            by <strong>Fran Dieguez</strong> using <a href="https://www.gatsbyjs.org">Gatsby</a>
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
