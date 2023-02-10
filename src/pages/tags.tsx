import React from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import SEO from '../components/seo';
import Layout from '../components/layout';

const Tags = ({ pageContext }) => {
  const { allMarkdownRemark, site } = useStaticQuery(graphql`
    query ($tag: String) {
      site {
        siteMetadata {
          title
        }
      }
      allMarkdownRemark(
        limit: 2000
        filter: { frontmatter: { tags: { in: [$tag] } } }
        sort: { frontmatter: { date: DESC } }
      ) {
        totalCount
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
            }
          }
        }
      }
    }
  `);
  const { tag } = pageContext;
  const siteTitle = site.siteMetadata.title;
  const { edges, totalCount } = allMarkdownRemark;
  const tagHeader = `${totalCount} post${
    totalCount === 1 ? '' : 's'
  } tagged with "${tag}"`;

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Contact" />
      <div className="page wrapper">
        <h1>{tagHeader}</h1>
        <ul>
          {edges.map(({ node }) => {
            const { slug } = node.fields;
            const { title } = node.frontmatter;
            return (
              <li key={slug}>
                <Link to={slug}>{title}</Link>
              </li>
            );
          })}
        </ul>

        <Link to="/tags">All tags</Link>
      </div>
    </Layout>
  );
};

export default Tags;
