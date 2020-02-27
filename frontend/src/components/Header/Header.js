import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';

const Header = () => {
  const [onSticky, setOnSticky] = useState(false);

  useEffect(() => {
    registerHeaderSticky({ stickySize: 70 });
  }, []);

  const registerHeaderSticky = ({ stickySize }) => {
    window.onscroll = () => {
      if (window.pageYOffset > stickySize) {
        setOnSticky(true);
      } else {
        setOnSticky(false);
      }
    };
  };

  return (
    <nav className={onSticky ? "nav-box sticky" : "nav-box"}>
      <h1 className="logo-box">
        <Link className="logo-box__a" to="/"><div className="logo-box__desc">Yaein</div></Link>
      </h1>
      <div className="nav-box__flex">
        <ul className="nav-box__list">
          <li className="nav-box__item"><Link to="/" className="nav-box__a">출석체크</Link></li>
          <li className="nav-box__item"><Link to="#" className="nav-box__a">교회소식</Link></li>
          <li className="nav-box__item"><Link to="#" className="nav-box__a">소식과 나눔</Link></li>
          <li className="nav-box__item"><Link to="#" className="nav-box__a">교회학교</Link></li>
        </ul>
      </div>
      <div className="logo-box">
        <a><FontAwesomeIcon className="logo-box__logo--user" icon={faUserCircle} /></a>
      </div>
    </nav>
  );
};

export default Header;