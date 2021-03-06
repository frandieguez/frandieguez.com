import React from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';
import Image from 'gatsby-image';

import { rhythm } from '../utils/typography';

import * as bioStyles from '../styles/bio.module.scss';

const Bio = ({ variant = 'simple' }) => (
  <StaticQuery
    query={bioQuery}
    render={(data) => {
      const { author, social } = data.site.siteMetadata;
      return (
        <>
          {variant == 'big' ? (
            <div className={bioStyles.bioLargeWrapper}>
              <div className={bioStyles.heroWrapper}>
                <div className={bioStyles.heroImage}>
                  <Image
                    fluid={data.avatarBig.childImageSharp.fluid}
                    alt={author}
                    imgStyle={{
                      borderRadius: `50%`,
                    }}
                  />
                </div>
                <div className={bioStyles.heroText}>
                  <h1 className={bioStyles.hero}>Hey, I'm Fran !</h1>
                  <h2 className={bioStyles.subhero}>
                    A <strong>software developer</strong> who lives and works in
                    Spain building useful things.
                    <br />
                  </h2>
                  <p>
                    No matter the position I've been in my career, software
                    developer, Tech Lead, Head of Research and Development or
                    CTO, my main focus always is to create useful tools that
                    make impact on users.
                  </p>
                </div>
              </div>
              {/* <div className={bioStyles.bioExplanation}></div> */}
            </div>
          ) : (
            <div className={bioStyles.wrapper}>
              <Image
                fixed={data.avatar.childImageSharp.fixed}
                alt={author}
                style={{
                  marginRight: rhythm(1 / 2),
                  marginBottom: 0,
                  minWidth: 100,
                  maxWidth: 100,
                  maxHeight: 100,
                  borderRadius: `100%`,
                }}
                imgStyle={{
                  borderRadius: `50%`,
                }}
              />
              <div className={bioStyles.message}>
                Hi! I'm <strong>{author}</strong>, I'm a software developer who
                lives and works in Spain building useful things.
                <Link className={bioStyles.subscribeLink} to="/rss.xml">
                  <svg viewBox="0 0 800 800">
                    <path d="M493 652H392c0-134-111-244-244-244V307c189 0 345 156 345 345zm71 0c0-228-188-416-416-416V132c285 0 520 235 520 520z" />
                    <circle cx="219" cy="581" r="71" />
                  </svg>
                  Subscribe
                </Link>
                <p>
                  <a href={`https://twitter.com/${social.twitter}`}>
                    Follow me on Twitter
                  </a>
                </p>
              </div>
            </div>
          )}
        </>
      );
    }}
  />
);

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fixed(width: 300, height: 300) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    avatarBig: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fluid(maxWidth: 500) {
          aspectRatio
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    site {
      siteMetadata {
        author
        social {
          twitter
        }
      }
    }
  }
`;

export default Bio;
