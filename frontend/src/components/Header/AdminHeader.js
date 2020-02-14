import React from 'react';
import './Header.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';

const AdminHeader = (props) => {
  return (
    <nav className="nav-box">
      <h1 className="logo-box">
        <a className="logo-box__a" href="/admin"><div className="logo-box__desc">Yaein</div></a>
      </h1>
      <div className="nav-box__flex">
        <ul className="nav-box__list">
          <li className="nav-box__item"><a href="/" className="nav-box__a">멤버관리</a></li>
          <li className="nav-box__item"><a href="#" className="nav-box__a">교회관리</a></li>
          <li className="nav-box__item"><a href="#" className="nav-box__a">시트관리</a></li>
        </ul>
      </div>
      <div className="logo-box">
        <a><FontAwesomeIcon className="logo-box__logo--user" icon={faUserCircle} /></a>
      </div>
    </nav>
  )
}

export default AdminHeader;