import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';
import Bio from '../components/bio';
import Waves from '../components/Waves';
import * as aboutStyles from '../styles/about.module.scss';
import { FaMapMarkerAlt } from 'react-icons/fa';

const Timeline = () => {
  const events = [
    {
      title: "Situm",
      description:
        "Currently I'm helping to create the visual part of Situm, an awesome company that helps multiple industries to position their users (robots and people) indoors while doing Business Intelligence on gathered data.",
      link: "https://situm.es/es",
    },
    {
      title: "OpenNemas",
      description:
        "Before I've been proudly creating different tools focused on high performance and heavy loaded systems that helped journalists to maintain online newspapers, developing OpenNemas.",
      link: "http://www.opennemas.com/",
    },
    {
      title: "University of Santiago de Compostela",
      description:
        "Prior to that I've been working as an open-source software consultant at the University of Santiago de Compostela, where I've developed a custom Linux-based desktop to simplify administrative tasks and also did massive migrations to open source software in educational settings. This project won the Libre Software contest in Galicia, Spain.",
      link: "http://www.mancomun.org/es/no_cache/actualidade/detalledenova/nova/a-osl-da-usc-gana-o-premio-eganet-2009-na-categoria-software-libre/",
    },
  ];

  return (
    <div className="relative pl-6 space-y-6 mt-10 mb-10">
      {events.map((event, index) => (
        <div key={index} className="relative group">
          <div className="absolute -left-3 w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white shadow-lg">
            <FaMapMarkerAlt size={14} />
          </div>
          <div className="p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">
              <a href={event.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {event.title}
              </a>
            </h3>
            <p className="text-gray-600 mt-1">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

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

      <Bio />
      <Waves />

      <div className={`${aboutStyles['aboutWrapper']} wrapper page`}>


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
          </a>{' '}
          and open source technology.
        </p>
        <p>About my working experience:</p>
        <Timeline />
        <p>
          Whenever not thinking on software development:

          <ul>
            <li>

              I can be found contributing
              to{' '}
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
            </li>

            <li>

              or doing sports like Crossfit and snowboard 🏂.
            </li>
          </ul>
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
