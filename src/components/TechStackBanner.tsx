import React from "react";
import { FaJava, FaReact, FaNodeJs } from "react-icons/fa";
import { SiTypescript, SiRedux, SiMaplibre, SiWebgl } from "react-icons/si";
import { CiGlobe } from 'react-icons/ci';
import { DiRuby } from "react-icons/di";

const technologies = [
  { name: "Java", icon: <FaJava className="text-gray-700 text-4xl" />, text: "Java", link: "https://www.java.com/" },
  { name: "Ruby", icon: <DiRuby className="text-gray-700 text-4xl" />, text: "Ruby", link: "https://www.ruby-lang.org/" },
  { name: "TypeScript", icon: <SiTypescript className="text-gray-700 text-4xl" />, text: "TypeScript", link: "https://www.typescriptlang.org/" },
  { name: "Node.js", icon: <FaNodeJs className="text-gray-700 text-4xl" />, text: "Node.js", link: "https://nodejs.org/" },
  { name: "React", icon: <FaReact className="text-gray-700 text-4xl" />, text: "React", link: "https://react.dev/" },
  { name: "Redux", icon: <SiRedux className="text-gray-700 text-4xl" />, text: "Redux", link: "https://redux.js.org/" },
  { name: "MapLibre", icon: <SiMaplibre className="text-gray-700 text-4xl" />, text: "MapLibre", link: "https://maplibre.org/" },
  { name: "Deck.gl", icon: <CiGlobe className="text-gray-700 text-4xl" />, text: "Deck.gl", link: "https://deck.gl/" },
  { name: "WebGL", icon: <SiWebgl className="text-gray-700 text-4xl" />, text: "WebGL", link: "https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API" }
];

const TechStackBanner = () => {
  return (
    <div className="w-full py-4 flex justify-center">
      <div className="flex space-x-6">
        {technologies.map((tech, index) => (
          <a key={index} href={tech.link} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center hover:text-blue-500">
            {tech.icon}
            <span className="text-gray-700 text-sm mt-2">{tech.text}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default TechStackBanner;
