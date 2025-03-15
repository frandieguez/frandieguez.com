import React from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';
import Vader from '../../static/assets/logos/darth.svg';
import * as postStyles from '../styles/post.module.scss';
import * as indexStyles from '../styles/index.module.scss';

const NotFoundPage = ({ location }) => {
  const { site, allMarkdownRemark } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }

      allMarkdownRemark(
        filter: { frontmatter: { published: { eq: true } } }
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
  const posts = allMarkdownRemark.edges
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  return (
    <Layout location={location} title={site.siteMetadata.title}>
      <SEO title="404: Not Found" />
      <div className={postStyles['post']}>


        <div className="wrapper404">
          <div className="error404Image">
            <Vader />
          </div>
          <div>
            <h1 className="error404Title">Error #404</h1>
            <div className="error404Message">
              I find your lack of navigation disturbing.
            </div>
            <h4 className="mt-10">Maybe you can check one of my posts below.</h4>
            {posts.map(({ node }) => {
              let title = node.frontmatter.title || node.fields.slug;
              return (
                <div key={node.fields.slug} className={indexStyles['post']}>
                  <h3 className={`${indexStyles['title']}`}>
                    <Link className="text-lg" to={node.fields.slug}>{title}</Link>
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
          </div>
        </div>
      </div>
    </Layout >
  );
};

export default NotFoundPage;
