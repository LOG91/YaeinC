import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './AddForm.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { BasicDropDown } from '../DropDown';

import { changeCurrentInfo } from '../../store/modules/checker';
import { insertMemberData, initMemberData } from '../../store/modules/inserted';


const SheetForm = ({ onToggleModal }) => {
  const { name, section } = useSelector(state => state.inserted.insertedMember);
  const { attached, attachedId, sheets } = useSelector(state => state.checker);
  const dispatch = useDispatch();

  const [isEmptyName, setIsEmptyName] = useState(false);
  useEffect(() => {
    initData();
    return () => dispatch(initMemberData());
  }, []);

  const addSheet = () => {
    if (name.trim() === '') setIsEmptyName(true);
    else {
      fetch('/api/sheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, attachedId, section })
      }).then(res => {
        onToggleModal({ action: 'addSheet' });
        return res.json();
      }).then(res => {
        dispatch(changeCurrentInfo('sheets', [...sheets, res]));
      });
    }
  };

  const handleChange = (left, right) => {
    if (name.trim() !== '') setIsEmptyName(false);
    dispatch(insertMemberData(left, right));
  };

  const initData = () => {
    handleChange('attached', attached);
    handleChange('section', '이스라엘');
  };

  return (
    <div className="add-form">
      <div className="add-form__icon"><FontAwesomeIcon icon={faAddressCard} /><h4>시트 추가</h4></div>
      <div>
        <div className="add-form__box">
          <div className="add-form__left">소속</div>
          <div className="add-form__right">{attached}</div>
        </div>
        <div className="add-form__box">
          <div className="add-form__left">지역군</div>
          <BasicDropDown kind="section" list={['이스라엘', '아랍', '아시아']} handler={handleChange} initialValue={section} />
        </div>
        <div className="add-form__box">
          <div className="add-form__left">시트 이름</div>
          <input className={`add-form__right--input ${isEmptyName && 'empty'}`} name="name" onChange={({ target }) => handleChange(target.name, target.value)} />
        </div>
        <div className="add-form__bottom">
          <button className="btn btn-outline-dark add_member_btn add-form__btn--bottom" onClick={() => addSheet()}>등록</button>
          <button className="btn btn-outline-dark add-form__btn--bottom" onClick={onToggleModal}>닫기</button>
        </div>
        <div className={`add-form__empty-alert ${isEmptyName && 'active'}`}>빨간색 네모 안을 입력하세요 :)</div>
      </div>
    </div>
  );
};

export default SheetForm;