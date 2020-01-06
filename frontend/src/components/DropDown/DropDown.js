import React from 'react';

export const CountDropDown = ({ handler, length, leaderInfo, option, leaderIndex }) => {
  const options = Array(length).fill(0).map((cv, idx) => {
    return (
      <a
        className="dropdown-item"
        onClick={() => handler(leaderInfo._id, leaderIndex, option, idx)}>{idx}
      </a>)
  });

  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle selectBox"
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
  )
}

export const CellDropDown = ({ cellList }) => {
  const options = Array(cellList.length).fill(0).map((cv, idx) => {
    return (
      <a
        className="dropdown-item"
        >{cv}
      </a>)
  })
  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle selectBox"
        type="button"
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false">
        셀선택
      </button>
      <div className="dropdown-menu selectBox__option" aria-labelledby="dropdownMenuButton">
        {options}
      </div>
    </div>
  )
}
