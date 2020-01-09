import React from 'react';
import './Main.scss'

const Main = () => {
  return (
    <div className="card-wrapper">
      <div className="card" style={{"width": "18rem"}}>
        <div className="card-body">
          <h5 className="card-title">🐑HOLY 청년부</h5>
          <a href="/holy" className="btn btn-outline-dark">출석체크</a>
        </div>
      </div>
      <div className="card" style={{"width": "18rem"}}>
        <div className="card-body">
          <h5 className="card-title">🔥벧엘 청년부</h5>
          <a href="/bethel" className="btn btn-outline-dark">출석체크</a>
        </div>
      </div>
    </div>
  )
};

export default Main;