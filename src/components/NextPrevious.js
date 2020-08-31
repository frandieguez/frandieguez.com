import React from 'react';
import { Link } from 'gatsby';
import NextPreviousStyles from '../styles/nextPrevious.module.scss';

const NextPrevious = ({ previous, next }) => {
  return (
    <nav className={NextPreviousStyles.wrapper}>
      <hr className={NextPreviousStyles.separator} />

      <div className={NextPreviousStyles.links}>
        {previous && (
          <div className={NextPreviousStyles.prev}>
            <Link to={previous.fields.slug} rel="prev">
              ← {previous.frontmatter.title}
            </Link>
          </div>
        )}

        {next && (
          <div className={NextPreviousStyles.next}>
            <Link to={next.fields.slug} rel="next">
              {next.frontmatter.title} →
            </Link>
          </div>
        )}
      </div>

      <hr className={NextPreviousStyles.separator} />
    </nav>
  );
};

export default NextPrevious;
