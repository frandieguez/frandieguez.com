import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

class AboutPage extends React.Component {
  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata;

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="About" />
        <img
          className="alignright"
          src="/assets/fran_dieguez.jpg"
          width="300"
          height="300"
          alt="Fran Dieguez"
        />
        <p>
          Hi! I'm <strong>Fran Diéguez</strong> and I've been developing web
          applications as a Full Stack Developer since 2006. I've been in
          multiple positions thoughtout my career, from a software developer,
          lead developer, CTO, and{' '}
          <strong>Head of Research and Development</strong>. My main focus is to
          create useful tools that make impact on users.
        </p>
        I've being using different technologies over the time:
        <ul>
          <li>
            on the server side I have created products with Ruby, PHP, Node.js
            and roughtly with Golang on Microservices,
          </li>
          <li>
            on the client side, I've passed from the origins of the web, using
            VanillaJS, jQuery, to jump to AngularJS, Angular 2 and finally
            React.
          </li>
        </ul>
        <p>
          Later years I've being proudly creating different tools focused in
          high performance and heavy loaded systems that help journalists to
          maintain online newspapers,{' '}
          <a
            href="http://www.opennemas.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            OpenNemas
          </a>
          .
        </p>
        <p>
          But now I help to create the visual part of{' '}
          <a
            href="https://situm.es/es"
            rel="noopener noreferrer"
            title="Situm, indoor positioning"
            target="_blank"
          >
            Situm
          </a>
          , an awesome company that helps multiple industries to position their
          users (robots and people) indoors.
        </p>
        <p>
          For a long time my main focus was web performance, 
          <a
            href="https://github.com/frandieguez"
            rel="noopener noreferrer"
            target="_blank"
          >
            engineering
          </a>
           and open source technology.
        </p>
        <p>
          Prior to focusing on online newspapers I've been working as a
          open-source software consultant at the University of Santiago de
          Compostela, where I've{' '}
          <strong>developed a custom Linux-based desktop</strong> in order to
          simplify administrative tasks and also doing massive migrations to
          open source sofware in educational settings. This project 
          <a
            href="http://www.mancomun.org/es/no_cache/actualidade/detalledenova/nova/a-osl-da-usc-gana-o-premio-eganet-2009-na-categoria-software-libre/"
            rel="noopener noreferrer"
            target="_blank"
          >
            won the Libre Software contest
          </a>
           in Galicia, Spain.
        </p>
        <p>
          Whenever not thinking on web development, I can be found contributing
          to 
          <a
            href="https://www.ohloh.net/accounts/frandieguez"
            rel="noopener noreferrer"
            target="_blank"
          >
            open-source projects
          </a>{' '}
          👨‍💻 like <strong>GNOME</strong> (as a member of the GNOME
          Foundation) or in Ubuntu as Galician translators coordinator, 
          <a
            href="https://www.amazon.com/gp/pdp/profile/A362F32UBZHEUR"
            rel="noopener noreferrer"
            target="_blank"
          >
            reading
          </a>
           or doing sports like Crossfit and snowboard 🏂.
        </p>
        <p>
          Currently I'm <strong>not available for hire</strong> but you can
          write me to propose me future and innovative projects.
        </p>
      </Layout>
    );
  }
}

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
