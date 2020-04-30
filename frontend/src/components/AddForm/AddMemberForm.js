import React, { useEffect } from 'react';
import './AddForm.scss';
import { useDispatch, useSelector } from 'react-redux';
import { insertMemberData, initMemberData } from '../../store/modules/inserted';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';

const AddMemberForm = ({ cellInfo, onToggleModal, confirmAction }) => {
  const { emptyWarning, insertedMember } = useSelector(state => state.inserted);
  const { attached, section } = useSelector(state => state.checker);
  const dispatch = useDispatch(null);

  useEffect(() => {
    dispatch(insertMemberData('attached', attached));
    dispatch(insertMemberData('leader_id', cellInfo._id));
    dispatch(insertMemberData('cellNameKr', cellInfo.name));

    if (!cellInfo) return;
    initInsertedMember({ info: cellInfo, wish: ['cellName', 'section', 'gender'], fn: insertMemberData });
    return () => {
      dispatch(initMemberData());
      dispatch({ type: 'ALL_OUT_EMPTY' });
    };
  }, []);

  const isEmptyError = ({ obj }) => {
    for (const value in obj) {
      if (obj[value]) return true;
    }
    return false;
  };

  const initInsertedMember = ({ info, wish, fn }) => {
    wish.forEach(item => {
      dispatch(fn(item, info[item]));
    });
  };

  const onChangeData = ({ target }) => {
    target.value !== '' ? dispatch({ type: 'OUT_EMPTY', target: target.name }) : null;
    dispatch(insertMemberData(target.name, target.value));
  };

  return (
    <div className="add-form">
      <div className="add-form__icon"><FontAwesomeIcon icon={faAddressCard} /><h4>멤버추가</h4></div>
      <div>
        <div className="add-form__box">
          <div className="add-form__left">소속</div>
          <div className="add-form__right">{attached}</div>
        </div>
        <div className="add-form__box">
          <div className="add-form__left">지역군</div>
          <div className="add-form__right">{section}</div>
        </div>
        <div className="add-form__box">
          <div className="add-form__left">셀</div>
          <div className="add-form__right">{insertedMember.cellNameKr}</div>
        </div>
        <div className="add-form__box">
          <div className="add-form__left">성별</div>
          <div className="add-form__right">{insertedMember.gender === 'male' ? '남' : '여'}</div>
        </div>
        <div className="add-form__box">
          <div className="add-form__left">이름</div>
          <input className={`add-form__right--input ${emptyWarning.name ? 'empty' : ''}`} name="name" onChange={onChangeData}></input>
        </div>
        <div className="add-form__box">
          <div className="add-form__left">나이</div>
          <input className={`add-form__right--input ${emptyWarning.age ? 'empty' : ''}`} name="age" onChange={({ target }) => dispatch(insertMemberData(target.name, target.value))}></input>
        </div>
        <div className="add-form__bottom">
          <button className="btn btn-outline-dark add_member_btn add-form__btn--bottom" onClick={() => confirmAction({ insertedMember })}>등록</button>
          <button className="btn btn-outline-dark add-form__btn--bottom" onClick={onToggleModal}>닫기</button>
        </div>
        <div className={`add-form__empty-alert ${isEmptyError({ obj: emptyWarning }) && 'active'}`}>빨간색 네모칸을 입력해주세요 :)</div>
      </div>
    </div >
  );
};


export default AddMemberForm;