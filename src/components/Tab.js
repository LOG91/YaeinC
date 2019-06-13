import React from 'react';
import { NavLink } from 'react-router-dom';

const Tab = () => {
  const activeStyle = {
    borderBottom: '1px solid #9775fa',
    color: '#9775fa'
  }

  return (
    <ul className="tab">
      <li className="index"><NavLink to="/israel/1" activeStyle={activeStyle}>이스라엘군</NavLink></li>
      <li className="index"><NavLink>아랍군</NavLink></li>
      <li className="index"><NavLink>연해주&터키군</NavLink></li>
      <li className="index"><NavLink>청년예베(남)</NavLink></li>
      <li className="index"><NavLink>청년예베(여)</NavLink></li>
    </ul>
  )
}

export default Tab;