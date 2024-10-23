import React, { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { StaticImage } from 'gatsby-plugin-image';

// Note: Replace with your actual work experience data
const workExperience = [
  {
    company: 'Situm Technologies S.L.',
    role: 'Web Tech Lead',
    period: '2019 - Present',
    location: 'Remote',
    description:
      'Led development of scalable web Sass products using React and Node.js. Implemented microservices with Spring Boot, client applications with React and Redux, and help the team to fulfill their goals.',
    logo: 'https://situm.com/wp-content/themes/situm/img/logo-situm.svg',
  },
  {
    company: 'OpenHost S.L.',
    role: 'Full Stack Developer',
    period: '2009 - 2019',
    location: 'Remote',
    description:
      'Developed and maintained a custom built SaaS product for online newspapers. Worked with technologies like PHP, Symfony Framework, Ruby, Varnish and MariaDB.',
    logo: 'https://www.openhost.es/wp-content/uploads/2015/08/openhost-logo.png',
  },
  {
    company: 'University of Santiago de Compostela',
    role: 'Open Source Consultant',
    period: '2018 - 2011',
    location: 'Santiago de Compostela, Spain',
    description:
      "Started my career working creating open source tools and developing the GNU/Linux distribution for the university's internal services (authentication, personalization, automated installation).",
    logo: 'https://assets.usc.gal/sites/default/files/styles/content_inner_image/public/image/2022-10/USC_0.png?itok=-VVCoWUl',
  },
];

const CompanyLogo: React.FC<{
  company: string;
  logo: string;
  children?: ReactNode;
}> = ({ company, logo, children }) => {
  return (
    <div className={`absolute top-6 right-4 w-14 `}>
      <img
        src={logo}
        alt={`${company} logo`}
        className="w-full h-full object-contain rounded-full"
      />
    </div>
  );
};

const WorkExperienceRightTimeline: React.FC<{ className: string }> = ({
  className,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number>(null);

  return (
    <section className="">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          My Working Experience
        </h2>
        <div className="max-w-3xl mx-auto relative">
          {/* Vertical line */}
          {/* <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div> */}

          {workExperience.map((job, index) => (
            <motion.div
              key={index}
              className="mb-8 ml-12 relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              {/* Timeline dot */}
              {/* <div className="absolute -left-10 top-5 w-3 h-3 bg-slate-500 rounded-full border-2 border-white shadow"></div> */}

              {/* Date on the timeline */}
              {/* <div className="absolute -left-40 top-5 w-24 text-right">
                <span className="text-sm font-medium text-gray-500">
                  {job.period}
                </span>
              </div> */}

              <div className="bg-white rounded-lg shadow-md overflow-hidden relative hover:shadow-lg transition-shadow duration-300">
                <CompanyLogo company={job.company} logo={job.logo} />
                <div
                  className="p-6 cursor-pointer"
                  onClick={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                >
                  <div className="flex items-center text-sm text-gray-400">
                    {job.period}
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {job.company}
                      </h3>
                      <p className="text-lg text-gray-600">{job.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location}
                  </div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: expandedIndex === index ? 'auto' : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-gray-700 text-sm mb-4">
                      {job.description}
                    </p>
                  </motion.div>
                  <div className="flex justify-center">
                    {expandedIndex === index ? (
                      <ChevronUp className="w-6 h-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkExperienceRightTimeline;
