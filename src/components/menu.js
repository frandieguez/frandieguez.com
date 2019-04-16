import React, { useState } from 'react';
import menuStyles from '../styles/menu.module.scss'
import { Link } from "gatsby"

const Menu = (props) => {

  const [open, setOpen] = useState(false);

  return (
    <div className={menuStyles.MenuWrapper}>
      <div className={menuStyles.MenuToggler} onClick={() => setOpen(!open)}>
        <a className={`${open ? menuStyles.MenuOpenButton : ''} ${menuStyles.showMenu}`}
          href="#menu"><span>☰</span></a>
      </div>

      <section className={`${open ? menuStyles.MenuOpen : ''} ${menuStyles.Menu}`}>
        <ul>
          <li>
            <Link to={'/about'} className={menuStyles.item}>The author</Link>
          </li>
          {/* <li>
            <Link to={'/code'} className={menuStyles.item}>Work</Link>
          </li> */}
          <li>
            <Link to={'/archives'} className={menuStyles.item}>Arquive</Link>
          </li>
          <li>
            <Link to={'/contact'} className={menuStyles.item}>Contact</Link>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default Menu;
