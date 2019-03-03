import React from "react"
import { Link } from "gatsby"
import NextPreviousStyles from "../styles/nextPrevious.module.scss"
import PropTypes from "prop-types"

function NextPrevious({ previous, next }) {
  return (
    <ul className={NextPreviousStyles.wrapper}>
      <li className={NextPreviousStyles.prev}>
        {previous && (
          <Link to={previous.fields.slug} rel="prev">
            ← {previous.frontmatter.title}
          </Link>
        )}
      </li>
      <li className={NextPreviousStyles.next}>
        {next && (
          <Link to={next.fields.slug} rel="next">
            {next.frontmatter.title} →
          </Link>
        )}
      </li>
    </ul>
  )
}

NextPrevious.propTypes = {
  next: PropTypes.isRequired,
  previous: PropTypes.isRequired,
}

export default NextPrevious
