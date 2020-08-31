import React from 'react';
import { graphql, Link } from 'gatsby';

// import Bio from "../components/bio"
import Layout from '../components/layout';
// import Wip from "../components/wip"
import SEO from '../components/seo';
// import Post from "../components/Post"

import indexStyles from '../styles/archive.module.scss';

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title;
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" keywords={data.site.siteMetadata.keywords} />
      {/* <Bio /> */}

      <h3>Recently Published</h3>
      <ul>
        {posts.map(({ node }) => {
          let title = node.frontmatter.title || node.fields.slug;
          return (
            <li key={node.fields.slug} className={indexStyles.post}>
              <Link to={node.fields.slug}>{title}</Link>
            </li>
          );
        })}
      </ul>
      <h3>Archives by Month</h3>
      <div>In construction</div>
      <p />

      <h3>Archives by year</h3>
      <div>In construction</div>
    </Layout>
  );
};

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
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 30
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
export default BlogIndex;
