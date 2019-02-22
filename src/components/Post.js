import React from 'react';
import { Link } from 'gatsby'
import indexStyles from '../styles/index.module.scss'

function Post({ node }) {
  const title = node.frontmatter.title || node.fields.slug

  return (
    <div key={node.fields.slug}>
      <h3 className={indexStyles.title}>
        <Link to={node.fields.slug}>
          {title}
        </Link>
      </h3>
      <div className={indexStyles.date}>{node.frontmatter.date}</div>
      <div className={indexStyles.excerpt} dangerouslySetInnerHTML={{ __html: node.excerpt }} />
    </div>
  )
}

export default Post;
