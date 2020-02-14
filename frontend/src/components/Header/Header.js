import React from 'react';
import './Header.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';

const Header = (props) => {

  return (
    <nav className="nav-box">
      <h1 className="logo-box">
        <a className="logo-box__a" href="/admin"><div className="logo-box__desc">Yaein</div></a>
      </h1>
      <div className="nav-box__flex">
        <ul className="nav-box__list">
          <li className="nav-box__item"><a href="/" className="nav-box__a">출석체크</a></li>
          <li className="nav-box__item"><a href="#" className="nav-box__a">교회소식</a></li>
          <li className="nav-box__item"><a href="#" className="nav-box__a">소식과 나눔</a></li>
          <li className="nav-box__item"><a href="#" className="nav-box__a">교회학교</a></li>
        </ul>
      </div>
      <div className="logo-box">
        <a><FontAwesomeIcon className="logo-box__logo--user" icon={faUserCircle} /></a>
      </div>
    </nav>
  )
}

export default Header;