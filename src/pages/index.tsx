import React from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';
import Bio from '../components/bio';
import Waves from '../components/Waves';

import * as indexStyles from '../styles/index.module.scss';
import WorkExperienceRightTimeline from '../components/WorkingExperience';

const BlogIndex = ({ location }) => {
  const { site, allMarkdownRemark } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          keywords
        }
      }
      allMarkdownRemark(
        filter: { frontmatter: { published: { eq: true } } }
        sort: { frontmatter: { date: DESC } }
        limit: 6
      ) {
        edges {
          node {
            excerpt
            fields {
              slug
            }
            frontmatter {
              date(formatString: "MMMM DD, YYYY")
              title
            }
          }
        }
      }
    }
  `);
  const siteTitle = site.siteMetadata.title;
  const posts = allMarkdownRemark.edges;

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" keywords={site.siteMetadata.keywords} />

      <Bio variant="big" />
      <Waves />

      <div className={indexStyles['contentWrapper']} role="main">
        <div className={indexStyles['postsWrapper']}>
          <h2
            className={`${indexStyles['postsWrapperTitle']} text-3xl font-bold text-center mb-6`}
          >
            My latests posts
          </h2>
          {posts.map(({ node }) => {
            let title = node.frontmatter.title || node.fields.slug;
            return (
              <div key={node.fields.slug} className={indexStyles['post']}>
                <h3 className={indexStyles['title']}>
                  <Link to={node.fields.slug}>{title}</Link>
                </h3>
                <span className={indexStyles['date']}>
                  {node.frontmatter.date}
                </span>
                {/* <div
                  className={indexStyles['excerpt']}
                  dangerouslySetInnerHTML={{ __html: node.excerpt }}
                /> */}
              </div>
            );
          })}

          <div className="more">
            <a href="/archives">Read previous posts...</a>
          </div>
        </div>
        <WorkExperienceRightTimeline
          className={indexStyles['experienceWrapper']}
        />
      </div>
      {/* <div className={indexStyles['moreContacts']}>
        <div className={indexStyles['moreContactsPhotos']}>Photos</div>
        <div className={indexStyles['moreContactsText']}>
          If you want to know what other amazing professionals that I admire and
          I have worked with think about me , check my{' '}
          <a
            target="_blank"
            rel="noopener"
            rel="noreferrer"
            href="https://www.linkedin.com/in/frandieguez/"
          >
            Linkedin
          </a>
        </div>
      </div> */}
    </Layout>
  );
};

export default BlogIndex;
