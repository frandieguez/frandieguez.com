import React from "react"
import { Link } from "gatsby"
import NextPreviousStyles from "../styles/nextPrevious.module.scss"
import PropTypes from "prop-types"

function NextPrevious({ previous, next }) {
  return (
    <ul>
      <li>
        {previous && (
          <Link to={previous.fields.slug} rel="prev">
            ← {previous.frontmatter.title}
          </Link>
        )}
      </li>
      <li>
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
