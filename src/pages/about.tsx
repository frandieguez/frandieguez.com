import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

const AboutPage = ({ data, location }) => {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <Layout location={location} title={site.siteMetadata.siteTitle}>
      <SEO title="About" />

      <div className="wrapper page">
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
          <strong>Head of Research and Development</strong>. 
        </p>
        <p>
          The objective on
          each project is to create useful tools that make impact on users.
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
          From the technical perspective my main focus is web performance, 
          <a
            href="https://github.com/frandieguez"
            rel="noopener noreferrer"
            target="_blank"
          >
            sustainable engineering
          </a>
           and open source technology.
        </p>
        <p>
          Currently I'm helping to create the visual part of{' '}
          <a
            href="https://situm.es/es"
            rel="noopener noreferrer"
            title="Situm, indoor positioning"
            target="_blank"
          >
            Situm
          </a>
          , an awesome company that helps multiple industries to{' '}
          <strong>
            position their users (robots and people) indoors while doing
            Bussiness Intelligence
          </strong>{' '}
          on gathered data.
        </p>
        <p>
          Before I've being proudly creating different tools focused on high
          performance and heavy loaded systems that helped journalists to
          maintain <strong>online newspapers</strong>, developing{' '}
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
          Prior that I've been working as a open-source software consultant at
          the University of Santiago de Compostela, where{' '}
          <strong>I've developed a custom Linux-based desktop</strong> in order
          to simplify administrative tasks and also doing massive migrations to
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
      </div>
    </Layout>
  );
};

export default AboutPage;
