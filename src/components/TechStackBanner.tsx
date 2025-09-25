import React, { useEffect, useRef } from "react";
import { FaJava, FaReact, FaNodeJs, FaGit } from "react-icons/fa";
import { SiTypescript, SiRedux, SiMaplibre, SiWebgl, SiFigma, SiPostgresql, SiSpringboot, SiGraphql, SiTailwindcss } from "react-icons/si";
import { CiGlobe } from 'react-icons/ci';
import { DiRuby } from "react-icons/di";

// import * as bioStyles from '../styles/bio.module.scss';

const technologies = [
    { name: "Java", icon: <FaJava />, link: "https://www.java.com/" },
    { name: "Spring Boot", icon: <SiSpringboot />, link: "https://spring.io/projects/spring-boot" },
    { name: "PostgreSQL", icon: <SiPostgresql />, link: "https://www.postgresql.org/" },
    // { name: "GraphQL", icon: <SiGraphql />, link: "https://graphql.org/" },
    { name: "Ruby", icon: <DiRuby />, link: "https://www.ruby-lang.org/" },
    { name: "TypeScript", icon: <SiTypescript />, link: "https://www.typescriptlang.org/" },
    { name: "Node.js", icon: <FaNodeJs />, link: "https://nodejs.org/" },
    { name: "React", icon: <FaReact />, link: "https://react.dev/" },
    { name: "Redux", icon: <SiRedux />, link: "https://redux.js.org/" },
    { name: "MapLibre", icon: <SiMaplibre />, link: "https://maplibre.org/" },
    { name: "Deck.gl", icon: <CiGlobe />, link: "https://deck.gl/" },
    { name: "WebGL", icon: <SiWebgl />, link: "https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API" },
    { name: "Tailwind CSS", icon: <SiTailwindcss />, link: "https://tailwindcss.com/" },
    // { name: "Figma", icon: <SiFigma />, link: "https://www.figma.com/" },
    { name: "Git", icon: <FaGit />, link: "https://git-scm.com/" }
];


const TechStackBanner = ({ className }: { className?: string }) => {
    return (
        <div className={`w-full py-4 ${className}`}>
            <div className="flex flex-wrap gap-6 justify-center align-middle text-center md:flex-nowrap">
                {technologies.map((tech, i) => (
                    <a
                        key={tech.name}
                        href={tech.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center  hover:text-accent-base/100"
                        title={`Language I use: ${tech.name}`}
                    >
                        <div className={" text-xl md:text-4xl"}>{tech.icon}</div>
                        <span className={"text-xs md:text-sm mt-1 md:mt-2 whitespace-nowrap"}>{tech.name}</span>
                    </a>
                ))}
            </div>
        </div >
    );
};

export default TechStackBanner;
