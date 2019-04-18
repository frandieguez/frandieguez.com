import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';
import Vader from '../../static/assets/logos/darth.svg';

class NotFoundPage extends React.Component {
  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title;

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="404: Not Found" />
        <h1 className="error404Title">Error #404</h1>
        <div className="wrapper404">
          <div className="error404Image">
            {' '}
            <Vader />{' '}
          </div>
          <div>
            {' '}
            <div className="error404Message">
              I find your lack of navigation disturbing.
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default NotFoundPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
