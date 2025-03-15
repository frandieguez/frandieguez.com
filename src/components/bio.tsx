import React from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import Img from 'gatsby-image';
import ParallaxTilt from 'react-parallax-tilt';
import { Typewriter } from 'react-simple-typewriter';

import * as bioStyles from '../styles/bio.module.scss';
import TechStackBanner from './TechStackBanner';

const Bio = ({ variant = 'simple' }) => {
  const { author, site, avatarBig } = useStaticQuery(bioQuery);

  if (variant === 'big') {
    return (
      <div className={bioStyles['bioLargeWrapper']}>
        <div className={bioStyles['heroWrapper']}>
          <div className={`${bioStyles['heroImage']} relative mb-4`}>
            <ParallaxTilt
              glareEnable={true}
              glareMaxOpacity={0.4}
              tiltMaxAngleX={25}
              tiltMaxAngleY={15}
              transitionSpeed={300}
              className="rounded-full"
            >
              <div
                style={{ backgroundColor: '#FFF8F3' }}
                className="size-72 animate-amoeba absolute md:-top-3 md:-left-3 top-1 left-1 z-0"
              ></div>
              <Img
                className="size-64 relative z-10 md:mr-12"
                fluid={avatarBig.childImageSharp.fluid}
                alt={author}
                imgStyle={{
                  borderRadius: '50%',
                }}
              />
            </ParallaxTilt>
          </div>
          <div className={bioStyles['heroText']}>
            <h1 className="text-4xl font-bold mb-6">
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
            <p>
              With over {new Date().getFullYear() - 2006} years of crafting solutions that truly matter, from my early days as a Software Developer to leading teams as Web Tech Lead, my passion has always remained the same: turning ideas into tools that enhance users' lives.
            </p>
          </div>
        </div>

        <div className={bioStyles['heroWrapper']}>
          <TechStackBanner />
        </div>
      </div >
    );
  }

  return <></>;
};

const bioQuery = graphql`
  query BioQuery {
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
      }
    }
  }
`;

export default Bio;
