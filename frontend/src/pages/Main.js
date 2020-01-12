import React from 'react';
import './Main.scss'

const Main = ({ match: { path } }) => {
  return (
    <div className="card-wrapper">
      <div className="card" style={{ "width": "18rem" }}>
        <div className="card-body">
          <h5 className="card-title">🐑HOLY 청년부</h5>
          <a href={path === "/admin" ? "/admin/holy" : "holy"} className="btn btn-outline-dark">출석체크</a>
        </div>
      </div>
      <div className="card" style={{ "width": "18rem" }}>
        <div className="card-body">
          <h5 className="card-title">🔥벧엘 청년부</h5>
          <a href={path === "/admin" ? "/admin/bethel" : "bethel"} className="btn btn-outline-dark">출석체크</a>
        </div>
      </div>
    </div>
  )
};

export default Main;