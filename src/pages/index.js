import React from "react"
import { graphql, Link } from "gatsby"

// import Bio from "../components/bio"
import Layout from "../components/layout"
import Wip from "../components/wip"
// import SEO from "../components/seo"
// import Post from "../components/Post"

import indexStyles from "../styles/index.module.scss"

class BlogIndex extends React.Component {
  render() {
    const { data }  = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts     = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        {/* <SEO
          title="All posts"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        /> */}
        {/* <Bio /> */}
        <Wip />
        {posts.map(({ node }) => {
          let title = node.frontmatter.title || node.fields.slug
          return (
            <div key={node.fields.slug} className={indexStyles.post}>
              <h3 className={indexStyles.title}>
                <Link to={node.fields.slug}>
                  {title}
                </Link>
              </h3>
              <span className={indexStyles.date}>{node.frontmatter.date}</span>
              {/* <div className={postStyles.excerpt} dangerouslySetInnerHTML={{ __html: node.excerpt }} /> */}
            </div>
          )
        })}
      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title,
        keywords
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { published: {eq: true }} },
      sort: { fields: [frontmatter___date], order: DESC }) {
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
`
export default BlogIndex
