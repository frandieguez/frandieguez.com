import React from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import Img from 'gatsby-image';

import { rhythm } from '../utils/typography';
import { Typewriter } from 'react-simple-typewriter';

import * as bioStyles from '../styles/bio.module.scss';

const Bio = ({ variant = 'simple' }) => {
  const { author, site, twitter, avatar, avatarBig } = useStaticQuery(bioQuery);

  if (variant == 'big') {
    return (
      <div className={bioStyles['bioLargeWrapper']}>
        <div className={bioStyles['heroWrapper']}>
          <div className={`${bioStyles['heroImage']} relative`}>
            <div
              style={{ backgroundColor: '#FFF8F3' }}
              className="size-72 animate-amoeba absolute md:-top-3 md:-left-3 top-1 left-1 z-0"
            ></div>
            <Img
              className="size-64 relative z-10 md:mr-12"
              fluid={avatarBig.childImageSharp.fluid}
              alt={author}
              imgStyle={{
                borderRadius: `50%`,
              }}
            />
          </div>
          <div className={bioStyles['heroText']}>
            <h1 className={`${bioStyles['hero']} text-4xl font-bold mb-6`}>
              Hey, I'm Fran <br />
              <span>
                <Typewriter
                  loop={true}
                  words={[
                    'a Web Tech Lead',
                    'an open sourcerer',
                    'a full stack developer',
                  ]}
                />
              </span>
            </h1>
            {/* <h2 className={bioStyles['subhero']}>
              <strong></strong>
              <br />
            </h2> */}
            <p>
              With over {new Date().getFullYear() - 2006} years of crafting
              solutions that truly matter, from my early days as a Software
              Developer to leading teams as Web Tech Lead, my passion has always
              remained the same: turning ideas into tools that enhance users'
              lives.
            </p>
            <ul
              className={`w-full flex justify-center md:justify-start ${bioStyles['socialNetworks']}`}
            >
              <li>
                <a
                  target="_blank"
                  href={`https://x.com/${site.siteMetadata.social.twitter}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    shapeRendering="geometricPrecision"
                    textRendering="geometricPrecision"
                    imageRendering="optimizeQuality"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    viewBox="0 0 512 462.799"
                  >
                    <path
                      fillRule="nonzero"
                      d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href={`https://linkedin.com/in/${site.siteMetadata.social.linkedin}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                    {' '}
                    <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href={`https://github.com/${site.siteMetadata.social.github}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* <div className={bioStyles['bioExplanation']}></div> */}
      </div>
    );
  }

  return (
    <div className={`${bioStyles['wrapper']} tilt`}>
      <Image
        fixed={avatar.childImageSharp.fixed}
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
      <div className={bioStyles['message']}>
        Hi! I'm <strong>{author}</strong>, I'm a software developer who lives
        and works in Spain building useful things.
        <Link className={bioStyles['subscribeLink']} to="/rss.xml">
          <svg viewBox="0 0 800 800">
            <path d="M493 652H392c0-134-111-244-244-244V307c189 0 345 156 345 345zm71 0c0-228-188-416-416-416V132c285 0 520 235 520 520z" />
            <circle cx="219" cy="581" r="71" />
          </svg>
          Subscribe
        </Link>
        <p>
          <a href={`https://twitter.com/${twitter}`}>Follow me on Twitter</a>
        </p>
      </div>
    </div>
  );
};

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
          github
          linkedin
        }
      }
    }
  }
`;

export default Bio;
