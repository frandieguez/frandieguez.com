import React from 'react';
import { graphql } from 'gatsby';

// import Bio from "../components/bio"
import Layout from '../components/layout';
import SEO from '../components/seo';
import NextPrevious from '../components/NextPrevious';
import PostInfo from '../components/postinfo';
import Bio from '../components/bio';

import postStyles from '../styles/post.module.scss';

import { DiscussionEmbed } from 'disqus-react';

const BlogPostTemplate = ({ location, data, pageContent }) => {
  const post = data.markdownRemark;
  const siteTitle = data.site.siteMetadata.title;
  const { previous, next } = pageContext;
  // const disqusShortname = "mabishu";
  // const disqusConfig = {
  //   identifier: post.dsq_thread_id || post.id,
  //   title: post.frontmatter.title
  // };

  const discussUrl = `https://mobile.twitter.com/search?q=${encodeURIComponent(
    `https://www.frandieguez.dev${location.pathname}`
  )}`;

  return (
    <Layout location={location} title={siteTitle} className="postStyles.post">
      <SEO title={post.frontmatter.title} description={post.excerpt} />
      <main className={postStyles.post}>
        <header>
          {post.frontmatter.layout !== 'phrase' ? (
            <div className={postStyles.meta}>
              <h1 className={postStyles.title}>{post.frontmatter.title}</h1>

              <time className={postStyles.date}> {post.frontmatter.date} </time>

              <div className={postStyles.author}>
                Inked by <a href="/about">{post.author || 'Fran Dieguez'}</a>
              </div>
            </div>
          ) : null}
        </header>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <footer>
          <div className={postStyles.postInfo}>
            <PostInfo
              categories={post.frontmatter.categories}
              tags={post.frontmatter.tags}
            />
          </div>
          <p>
            <a href={discussUrl} target="_blank" rel="noopener noreferrer">
              Discuss on Twitter
            </a>
          </p>
          {/* <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} /> */}
        </footer>
      </main>
      <aside>
        <Bio />
        <NextPrevious previous={previous} next={next} />
      </aside>
    </Layout>
  );
};

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
        layout
        title
        date(formatString: "MMMM DD, YYYY")
        dsq_thread_id
        author
        tags
        categories
      }
    }
  }
`;
export default BlogPostTemplate;
