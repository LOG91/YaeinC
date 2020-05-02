import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initMemberData } from '../../store/modules/checker';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { BasicDropDown } from '../DropDown';


const ChurchForm = ({ onToggleModal, handleChange, confirmAction }) => {
  const ATTACHED_LIST = ['청년', '장년', '오이코스'];
  const dispatch = useDispatch();
  const { attached, church, churches } = useSelector(state => state.checker);

  useEffect(() => {
    initData();
    return () => dispatch(initMemberData());
  }, []);
  const isEmptyName = useSelector(state => state.emptyCheck.churchForm.isEmptyName);

  const initData = () => {
    handleChange('attached', ATTACHED_LIST[0]);
  };

  return (
    <div className="add-form">
      <div className="add-form__icon"><FontAwesomeIcon icon={faFileAlt} /><h4>페이지 추가</h4></div>
      <div>
        <div className="add-form__box">
          <div className="add-form__left">페이지 이름</div>
          <input className={`add-form__right--input ${isEmptyName && 'empty'}`} name="church" onChange={({ target }) => handleChange(target.name, target.value)} />
        </div>
        <div className="add-form__box">
          <div className="add-form__left">소속</div>
          <BasicDropDown kind="attached" list={ATTACHED_LIST} handler={handleChange} initialValue={attached} />
        </div>
        <div className="add-form__bottom">
          <button className="btn btn-outline-dark add_member_btn add-form__btn--bottom" onClick={() => confirmAction({ church, attached, churches })}>등록</button>
          <button className="btn btn-outline-dark add-form__btn--bottom" onClick={() => onToggleModal({})}>닫기</button>
        </div>
      </div>
      <div className={`add-form__empty-alert ${isEmptyName && 'active'}`}>빨간색 네모 안을 입력하세요 :)</div>
    </div>
  );
};


export default ChurchForm;