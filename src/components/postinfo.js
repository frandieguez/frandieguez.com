import React from 'react';
import { Link } from 'gatsby';
import * as postStyles from '../styles/post.module.scss';
import _ from 'lodash';

const PostInfo = ({ tags, categories }) => {
  let categoriesHTML =
    categories.length > 0
      ? categories.map((category) => {
          return (
            <Link
              key={category}
              className={postStyles.categoryLink}
              to={'/category/' + category}
            >
              {category}
            </Link>
          );
        })
      : `Uncategorized`;

  let tagsHTML = tags
    ? tags.map((tag) => {
        return (
          <Link key={tag} className={postStyles.tagLink} to={`/tag/${_.kebabCase(tag)}`}>
            {tag}
          </Link>
        );
      })
    : null;

  return (
    <React.Fragment>
      Posted in {categoriesHTML} and tagged with {tagsHTML}
    </React.Fragment>
  );
};

export default PostInfo;
