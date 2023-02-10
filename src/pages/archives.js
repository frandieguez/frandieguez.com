import React from 'react';
import { graphql, Link } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

import * as indexStyles from '../styles/index.module.scss';

export const pageQuery = graphql`
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
`;

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title;
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" keywords={data.site.siteMetadata.keywords} />
      {/* <Bio /> */}

      <div className={`wrapper page ${indexStyles.postsWrapper}`}>
        <h2 className={indexStyles.postsWrapperTitle}>Recently Published</h2>
        {posts.map(({ node }) => {
          let title = node.frontmatter.title || node.fields.slug;
          return (
            <div key={node.fields.slug} className={indexStyles.post}>
              <h3 className={indexStyles.title}>
                <Link to={node.fields.slug}>{title}</Link>
              </h3>
              <span className={indexStyles.date}>{node.frontmatter.date}</span>
              {/* <div
                className={indexStyles.excerpt}
                dangerouslySetInnerHTML={{ __html: node.excerpt }}
              /> */}
            </div>
          );
        })}
        <h3>Archives by Month</h3>
        <div>In construction</div>
        <p />

        <h3>Archives by year</h3>
        <div>In construction</div>
      </div>
    </Layout>
  );
};

export default BlogIndex;
