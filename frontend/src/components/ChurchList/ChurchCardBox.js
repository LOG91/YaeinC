import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import './ChurchList.scss';

import { CHANGE_CHURCH_NAME } from '../../store/modules/checker';

const ChurchCardBox = ({ churches, isAdmin, handleDeleteChurch }) => {
  const dispatch = useDispatch();
  const [checker, setChecker] = useState(null);

  const changeChurchName = ({ id, name, idx }) => {
    dispatch({ type: CHANGE_CHURCH_NAME, name, idx });
    if (checker) {
      clearTimeout(checker);
      setChecker(setTimeout(() => {
        fetch('/api/church', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id, changedName: name })
        })
          .then(res => res.json())
          .then(res => console.log(res));
        setChecker(null);
      }, 1000));
    } else {
      setChecker(setTimeout(() => {
        fetch('/api/church', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id, changedName: name })
        })
          .then(res => res.json())
          .then(res => console.log(res));
        setChecker(null);
      }, 1000));
    }
  };

  return (
    <>
      {churches.map(({ name, attached, _id }, idx) => {
        return (
          <div key={attached + idx} data-id={_id} className={`card card-box ${isAdmin && "card-box--admin"}`}>
            <Link onClick={e => { if (e.target.className === "card-box__input") e.preventDefault(); }} to={isAdmin ? `admin/${name}` : name}>
              <div className="card-body">
                {isAdmin ? <input
                  className="card-box__input"
                  onChange={(e) => changeChurchName({ id: _id, name: e.target.value, idx })}
                  value={name} />
                  : <h5 className="card-title card-box__title">{name}</h5>}
                <h5 className="card-title card-box__subtitle">{attached}</h5>
              </div>
            </Link>
            {isAdmin && <div className="icon-wrapper">
              <div className="icon-wrapper__icon--move"><FontAwesomeIcon icon={faBars} /></div>
              <div className="icon-wrapper__icon--delete" onClick={() => handleDeleteChurch({ id: _id, idx })}><FontAwesomeIcon icon={faTrashAlt} /></div>
            </div>}
          </div>
        );
      })}

    </>
  );
};

export default ChurchCardBox;