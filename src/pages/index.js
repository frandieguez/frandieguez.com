import React from 'react';
import { graphql, Link } from 'gatsby';

// import Bio from "../components/bio"
import Layout from '../components/layout';
// import Wip from "../components/wip"
import SEO from '../components/seo';
// import Post from "../components/Post"
import Bio from '../components/bio';

import indexStyles from '../styles/index.module.scss';

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title;
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" keywords={data.site.siteMetadata.keywords} />

      <Bio variant="big" />

      <div className={indexStyles.contentWrapper}>
        <div>
          <h2>Things to put here</h2>
          <ul>
            <ol>one thing</ol>
            <ol>another thing</ol>
            <ol>and even more things...</ol>
          </ul>
          <h2>Things to put here</h2>
          <ul>
            <ol>one thing</ol>
            <ol>another thing</ol>
            <ol>and even more things...</ol>
          </ul>
        </div>

        <div className={indexStyles.postsWrapper}>
          <h2 className={indexStyles.postsWrapperTitle}>My latests posts</h2>
          {posts.map(({ node }) => {
            let title = node.frontmatter.title || node.fields.slug;
            return (
              <div key={node.fields.slug} className={indexStyles.post}>
                <h3 className={indexStyles.title}>
                  <Link to={node.fields.slug}>{title}</Link>
                </h3>
                <span className={indexStyles.date}>
                  {node.frontmatter.date}
                </span>
                {/* <div
                  className={indexStyles.excerpt}
                  dangerouslySetInnerHTML={{ __html: node.excerpt }}
                /> */}
              </div>
            );
          })}

          <div className="more">
            <a href="/archives">Read previous posts...</a>
          </div>
        </div>
      </div>
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
      limit: 10
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
