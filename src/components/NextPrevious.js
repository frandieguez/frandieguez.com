import React from "react"
import { Link } from "gatsby"
import NextPreviousStyles from "../styles/nextPrevious.module.scss"
// import PropTypes from "prop-types"

function NextPrevious({ previous, next }) {
  return (
    <ul className={NextPreviousStyles.wrapper}>
      {previous && (
      <li className={NextPreviousStyles.prev}>
          <Link to={previous.fields.slug} rel="prev">
            ← {previous.frontmatter.title}
          </Link>
      </li>
      )}

      {next && (
      <li className={NextPreviousStyles.next}>
          <Link to={next.fields.slug} rel="next">
            {next.frontmatter.title} →
          </Link>
      </li>
      )}
    </ul>
  )
}

// NextPrevious.propTypes = {
//   next: PropTypes.optionalFunc,
//   previous: PropTypes.optionalFunc
// }

export default NextPrevious
