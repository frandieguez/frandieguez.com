import React, { useState, useEffect } from 'react';
import menuStyles from '../styles/menu.module.scss';
import { Link } from 'gatsby';
import useDarkMode from 'use-dark-mode';

const Menu = () => {
  const [open, setOpen] = useState(false);
  const darkMode = useDarkMode(false);

  useEffect(() => {
    console.log(darkMode);
  }, [darkMode]);

  return (
    <div className={menuStyles.MenuWrapper}>
      <div className={menuStyles.MenuToggler} onClick={() => setOpen(!open)}>
        <a
          className={`${open ? menuStyles.MenuOpenButton : ''} ${
            menuStyles.showMenu
          }`}
          href="#menu"
        >
          <span>☰</span>
        </a>
      </div>

      <section
        className={`${open ? menuStyles.MenuOpen : ''} ${menuStyles.Menu}`}
      >
        <ul>
          <li>
            <Link to={'/about'} className={menuStyles.item}>
              The author
            </Link>
          </li>
          {/* <li>
            <Link to={'/code'} className={menuStyles.item}>Work</Link>
          </li> */}
          <li>
            <Link to={'/archives'} className={menuStyles.item}>
              Arquive
            </Link>
          </li>
          <li>
            <Link to={'/contact'} className={menuStyles.item}>
              Contact
            </Link>
          </li>
          <li>
            <button
              type="button"
              className={menuStyles.darkModeButton}
              onClick={darkMode.toggle}
              title="Toggle dark mode"
            >
              {darkMode.value ? '☾' : '☀'}
            </button>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Menu;
