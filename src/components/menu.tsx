import React, { useState, useEffect } from 'react';
import * as menuStyles from '../styles/menu.module.scss';
import { Link } from 'gatsby';
import useDarkMode from 'use-dark-mode';
import '@theme-toggles/react/css/classic.css';
import { Classic } from '@theme-toggles/react';

export default function () {
  const [open, setOpen] = useState(false);
  const darkMode = useDarkMode(false);

  return (
    <div className={menuStyles['MenuWrapper']}>
      <div className={menuStyles['MenuToggler']} onClick={() => setOpen(!open)}>
        <a
          className={`${open ? menuStyles['MenuOpenButton'] : ''} ${
            menuStyles['showMenu']
          }`}
          href="#menu"
        >
          <span>☰</span>
        </a>
      </div>
      <section
        className={`${open ? menuStyles['MenuOpen'] : ''} ${menuStyles['Menu']}`}
      >
        <ul>
          <li>
            <Link to={'/about'} className={menuStyles['item']}>
              About me
            </Link>
          </li>
          {/* <li>
            <Link to={'/code'} className={menuStyles['item']}>
              Work
            </Link>
          </li> */}
          <li>
            <Link to={'/archives'} className={menuStyles['item']}>
              Posts
            </Link>
          </li>
          <li>
            <Link to={'/contact'} className={menuStyles['item']}>
              Contact
            </Link>
          </li>
        </ul>
      </section>{' '}
      <Classic
        className={menuStyles['darkModeButton']}
        title="Toggle dark mode"
        toggle={darkMode.toggle}
        toggled={false}
        reversed
      />
      {/* <button
        type="button"
        className={menuStyles['darkModeButton']}
        onClick={darkMode.toggle}
        title="Toggle dark mode"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          width="1em"
          height="1em"
          fill="currentColor"
          stroke-linecap="round"
          className="theme-toggle__classic"
          viewBox="0 0 32 32"
        >
          <clipPath id="theme-toggle__classic__cutout">
            <path d="M0-5h30a1 1 0 0 0 9 13v24H0Z" />
          </clipPath>
          <g clip-path="url(#theme-toggle__classic__cutout)">
            <circle cx="16" cy="16" r="9.34" />
            <g stroke="currentColor" stroke-width="1.5">
              <path d="M16 5.5v-4" />
              <path d="M16 30.5v-4" />
              <path d="M1.5 16h4" />
              <path d="M26.5 16h4" />
              <path d="m23.4 8.6 2.8-2.8" />
              <path d="m5.7 26.3 2.9-2.9" />
              <path d="m5.8 5.8 2.8 2.8" />
              <path d="m23.4 23.4 2.9 2.9" />
            </g>
          </g>
        </svg>
      </button> */}
    </div>
  );
}
