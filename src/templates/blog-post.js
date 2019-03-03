import React from "react"
import { graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import NextPrevious from "../components/NextPrevious"

import postStyles from "../styles/post.module.scss"

import { DiscussionEmbed } from "disqus-react"

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext
    const disqusShortname = "mabishu";
    const disqusConfig = {
      identifier: post.id,
      title: post.frontmatter.title,
    };

    return (
      <Layout location={this.props.location} title={siteTitle} className="postStyles.post">
        <SEO title={post.frontmatter.title} description={post.excerpt} />
        <div className={postStyles.post}>
          <h1>{post.frontmatter.title}</h1>

          <p className={postStyles.date}>
            {post.frontmatter.date}
          </p>

          <div dangerouslySetInnerHTML={{ __html: post.html }} />

        </div>

        <Bio />
        <NextPrevious previous={previous} next={next} />
        <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
      </Layout>
    )
  }
}


export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
export default BlogPostTemplate
