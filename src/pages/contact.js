import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

const AboutPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title;

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Contact" />

      <div className="aligncenter">
        <p>
          If you have anything to say to me. Use the form below.{' '}
          <span role="img" aria-label="down">
            👇
          </span>
        </p>

        <form
          name="contact"
          className="contact"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
        >
          <p>
            <input type="text" placeholder="Your name" name="name" required />
          </p>
          <p>
            <input type="email" placeholder="Your email" name="email" />
          </p>
          <p>
            <textarea
              placeholder="Your message"
              name="message"
              id="message"
              cols="30"
              rows="10"
              required
            />
          </p>
          <p>
            <button type="submit">Send</button>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

export default AboutPage;
