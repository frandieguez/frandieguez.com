import { useState } from 'react';
import type { ReactNode, } from 'react';
import { motion } from 'framer-motion';
import { LuMapPin as MapPin, LuChevronDown as ChevronDown, LuChevronUp as ChevronUp } from 'react-icons/lu';
// import * as indexStyles from '../styles/index.module.scss';

// Note: Replace with your actual work experience data
const workExperience = [
    {
        company: 'Situm Technologies',
        role: 'Web Tech Lead',
        period: '2019 - Present',
        location: 'Remote',
        description:
            'Led development of scalable web Sass products using React and Node.js. Implemented microservices with Spring Boot, client applications with React and Redux, and help the team to fulfill their goals.',
        logo: 'https://situm.com/wp-content/themes/situm/img/logo-situm.svg',
    },
    {
        company: 'OpenHost',
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
        period: '2008 - 2011',
        location: 'Spain',
        description:
            "Started my career working creating open source tools and developing the GNU/Linux distribution for the university's internal services (authentication, personalization, automated installation).",
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Logotype_of_Universidade_de_Santiago_de_Compostela.svg/154px-Logotype_of_Universidade_de_Santiago_de_Compostela.svg.png',
    },
];

const CompanyLogo: React.FC<{
    company: string;
    logo: string;
    children?: ReactNode;
}> = ({ company, logo, children }) => {
    return (
        <div className="absolute top-6 right-4 w-20">
            <img
                src={logo}
                alt={`${company} logo`}
                className="w-full h-full object-contain grayscale"
            />
        </div>
    );
};

const WorkExperienceRightTimeline: React.FC<{ className: string }> = ({
    className,
}) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

    return (
        <section className={`${className}`}>
            <div className="">
                <h2 className="title text-xl  mb-6 text-accent-two">
                    My Working Experience
                </h2>
                <div className="mx-auto flex flex-col gap-4 relative">
                    {/* Vertical line */}
                    {/* <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div> */}

                    {workExperience.map((job, index) => (
                        <motion.div
                            key={job.period}
                            className="relative"
                            initial={{ opacity: 0, x: 20 }}  // Reduced x offset from 50 to 20
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                delay: index * 0.1,  // Reduced delay from 0.2 to 0.1
                                duration: 0.5,      // Added duration
                                ease: "easeOut"     // Added easing function
                            }}
                        >
                            {/* Timeline dot */}
                            {/* <div className="absolute -left-10 top-5 w-3 h-3 bg-slate-500 rounded-full border-2 border-white shadow"></div> */}

                            {/* Date on the timeline */}
                            {/* <div className="absolute -left-40 top-5 w-24 text-right">
                <span className="text-sm font-medium text-gray-500">
                  {job.period}
                </span>
              </div> */}

                            <div className=" rounded-lg shadow-xs overflow-hidden relative hover:shadow-lg transition-shadow duration-300 inline-grid w-full bg-color-75 px-2 py-2">
                                <button
                                    type="button"
                                    className="p-3 cursor-pointer w-full text-left bg-transparent border-none outline-none"
                                    onClick={() =>
                                        setExpandedIndex(expandedIndex === index ? null : index)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            setExpandedIndex(expandedIndex === index ? null : index);
                                        }
                                    }}
                                >
                                    <CompanyLogo company={job.company} logo={job.logo} />
                                    <div className="flex items-center text-sm ">
                                        {job.period} • <MapPin className="w-4 h-4 mr-1" />
                                        {job.location}
                                    </div>
                                    <div className="flex justify-between items-start ">
                                        <div>
                                            <h3 className="text-xl font-semibold ">
                                                {job.company}
                                            </h3>
                                            <p className="text-lg text-lighter">{job.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-sm  mb-2">

                                    </div>
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{
                                            height: expandedIndex === index ? "auto" : 0,
                                            opacity: expandedIndex === index ? 1 : 0
                                        }}
                                        transition={{
                                            duration: 0.3,
                                            ease: [0.04, 0.62, 0.23, 0.98] // Custom easing curve
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <p className="text-sm mb-4">
                                            {job.description}
                                        </p>
                                    </motion.div>

                                    <div className="flex justify-center">
                                        <motion.div
                                            animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ChevronDown className="w-6 h-6" />
                                        </motion.div>
                                    </div>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div >
        </section >
    );
};

export default WorkExperienceRightTimeline;
