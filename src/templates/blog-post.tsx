import React from 'react';
import { graphql } from 'gatsby';

// import Bio from "../components/bio"
import Layout from '../components/layout';
import SEO from '../components/seo';
import NextPrevious from '../components/NextPrevious';
import PostInfo from '../components/postinfo';
import Bio from '../components/bio';
import Calendar from '../../static/assets/icons/calendar.svg';

import * as postStyles from '../styles/post.module.scss';

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
const BlogPostTemplate = ({ location, data, pageContext }) => {
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
      <div className={postStyles['post']}>
        {post.frontmatter.layout !== 'phrase' ? (
          <header className={postStyles['meta']}>
            <h1 className={postStyles['title']}>{post.frontmatter.title}</h1>
            {/* <h2 className={postStyles['subtitle']}>
              We’ve all seen them. They drive the rest of the team crazy. How
              can we use them to our advantage?
            </h2> */}

            {/* <div>{post.frontmatter.excerpt}</div> */}

            <time className={postStyles['date']}>
              <Calendar className="icon" /> {post.frontmatter.date}{' '}
            </time>

            {/* <div className={postStyles['author']}>
                Inked by <a href="/about">{post.author || 'Fran Dieguez'}</a>
              </div> */}
          </header>
        ) : null}
        <div className={postStyles['contentWrapper']}>
          <div className={postStyles['content']}>
            <div
              className={postStyles['contentBlock']}
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </div>
          <footer>
            <div className={postStyles['postInfo']}>
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
          </footer>
        </div>
      </div>
      <aside className={postStyles['aside']}>
        {/* <Bio /> */}
        <NextPrevious previous={previous} next={next} />
      </aside>
    </Layout>
  );
};

export default BlogPostTemplate;
