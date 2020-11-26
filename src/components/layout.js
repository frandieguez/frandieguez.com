import React, { useState } from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';
// import Image from "gatsby-image"
import Menu from './menu';
import Logo from '../../static/assets/logos/header.svg';
// import Toggle from '../../static/assets/icons/toggle.svg';

import layoutStyles from '../styles/layout.module.scss';

const Layout = ({ location, title, children }) => {
  const [dark, toggleDark] = useState(false);
  const rootPath = `${__PATH_PREFIX__}/`;

  let header;
  let HeaderContent = (
    <StaticQuery
      query={SiteQuery}
      render={(data) => {
        return (
          <Link to={`/`} title={title}>
            <Logo />
            {/* <img src="/assets/logos/glasses.png" /> */}
            {/* <Image
                fixed={data.siteLogo.childImageSharp.fixed}
                alt={title}
              /> */}
          </Link>
        );
      }}
    />
  );

  if (location.pathname === rootPath) {
    header = <h1 className={layoutStyles.siteTitle}>{HeaderContent}</h1>;
  } else {
    header = <h3 className={layoutStyles.siteTitle}>{HeaderContent}</h3>;
  }

  return (
    <div className={`${layoutStyles.pageWrapper} ${dark ? 'dark-mode' : ''}`}>
      <header className={` ${layoutStyles.Header} ${layoutStyles.wrapper}`}>
        {/* <Toggle /> */}
        {header}

        <Menu />
      </header>

      <div className={layoutStyles.wrapper} role="main">
        <main>{children}</main>
      </div>
      <footer className={layoutStyles.Footer}>
        <div className={layoutStyles.footerContent}>
          <div className={layoutStyles.moreInfo}>
            <div>
              Do you need more information?
              <p>
                <strong>Let me know about you</strong>
              </p>
            </div>
            <div>
              <a href="/contact" className="btn btn-inverse">
                Connect with me
              </a>
            </div>
          </div>
          <div className={layoutStyles.copyright}>
            © {new Date().getFullYear()}, Web app designed and coded by{' '}
            <strong>Fran Dieguez</strong> using{' '}
            <a href="https://www.reactjs.org">React.js</a> +{' '}
            <a href="https://www.gatsbyjs.org">Gatsby</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

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
`;

export default Layout;
