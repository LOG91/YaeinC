import React from 'react';
import './DropDown.scss';

export const CountDropDown = ({ handler, length, leaderInfo, option, leaderIndex }) => {
  const options = Array(length).fill(0).map((cv, idx) => {
    return (
      <a
        key={leaderInfo._id + idx}
        className="dropdown-item"
        onClick={handler(leaderInfo._id, leaderIndex, option, idx)}>{idx}
      </a>)
  });

  return (
    <div className="dropdown-box">
      <button
        onClick={(evt)=>console.log(evt)}
        className="btn btn-secondary dropdown-toggle dropdown-box__button"
        type="button"
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false">
        {leaderInfo[option]}
      </button>
      <div className="dropdown-menu selectBox__option" aria-labelledby="dropdownMenuButton">
        {options}
      </div>
    </div>
  );
};

export const BasicDropDown = ({ kind, list, handler, initialValue }) => {
  const options = list.map((cv, idx) => {
    return (
      <a
        key={cv + idx}
        className="dropdown-item"
        onClick={() => handler(kind, cv)}
      >{cv}
      </a>)
  })
  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle select-box"
        type="button"
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false">
        {initialValue}
      </button>
      <div className="dropdown-menu selectBox__option" aria-labelledby="dropdownMenuButton">
        {options}
      </div>
    </div>
  )
}
