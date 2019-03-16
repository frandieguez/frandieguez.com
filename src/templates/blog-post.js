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
      identifier: post.dsq_thread_id || post.id,
      title: post.frontmatter.title,
    };

    return (
      <Layout location={this.props.location} title={siteTitle} className="postStyles.post">
        <SEO title={post.frontmatter.title} description={post.excerpt} />
        <div className={postStyles.post}>
          <div className={postStyles.meta}>
            <h1 className={postStyles.title}>{post.frontmatter.title}</h1>

            <time className={postStyles.date}> {post.frontmatter.date} </time>

            <div className={postStyles.author}>Inked by {post.author || 'Fran Dieguez'}</div>
          </div>

          <div dangerouslySetInnerHTML={{ __html: post.html }} />

        </div>

        {/* <Bio /> */}
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
        date(formatString: "MMMM DD, YYYY"),
        dsq_thread_id,
        author,
      },
    }
  }
`
export default BlogPostTemplate
