import React from 'react';
import './Header.scss';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';

const AdminHeader = (props) => {
  return (
    <nav className="nav-box">
      <h1 className="logo-box">
        <Link className="logo-box__a" to="/admin"><div className="logo-box__desc">Yaein</div></Link>
        <div className="logo-box__admin">admin</div>
      </h1>
      <div className="nav-box__flex">
        <ul className="nav-box__list">
          <li className="nav-box__item"><Link to="/admin" className="nav-box__a">교회관리</Link></li>
          <li className="nav-box__item"><Link to="/admin/members" className="nav-box__a">멤버관리</Link></li>
        </ul>
      </div>
      <div className="logo-box">
        <a><FontAwesomeIcon className="logo-box__logo--user" icon={faUserCircle} /></a>
      </div>
    </nav>
  )
}

export default AdminHeader;