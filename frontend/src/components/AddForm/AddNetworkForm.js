import React, { useState, useEffect } from 'react';
import './AddForm.scss';
import { useSelector, useDispatch } from 'react-redux';
import { insertNetworkCell } from '../../store/modules/checker';
import { insertMemberData, insertCellMember, initMemberData, removeCellMember } from '../../store/modules/inserted';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';

const AddNetworkForm = ({ cellInfo, onToggleModal, isAddNetwork }) => {

  const dispatch = useDispatch();
  const { attached, section, currentSheetInfo } = useSelector(state => state.checker);
  const { insertedMember } = useSelector(state => state.inserted);

  const [isEmptyAge, setIsEmptyAge] = useState(false);
  const [isEmptyCellName, setIsEmptyCellName] = useState(false);
  const [isEmptyNetworkLeaderName, setIsEmptyNetworkLeaderName] = useState(false);

  useEffect(() => {
    handleChange('attached', attached);
    handleChange('section', section);
    if (!cellInfo) return;
    initInsertedMember({ info: cellInfo, wish: ['cellNameKr', 'cellName', 'section', 'gender'], fn: handleChange });
    return () => dispatch(initMemberData());
  }, []);

  const initInsertedMember = ({ info, wish, fn }) => {
    wish.forEach(item => {
      fn(item, info[item]);
    });
  };

  const addNetworkCell = async () => {
    setIsEmptyAge(!insertedMember.age);
    setIsEmptyCellName(!insertedMember.cellNameKr);
    setIsEmptyNetworkLeaderName(!insertedMember.name);

    if (insertedMember.cellNameKr.trim() !== '' && insertedMember.name.trim() !== '' && insertedMember.age.trim() !== '') {
      await fetch('/api/networkCell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: insertedMember.cellNameKr,
          networkLeaderName: insertedMember.name,
          gender: insertedMember.gender,
          attached: insertedMember.attached,
          sheetId: currentSheetInfo._id
        })
      }).then(res => res.json())
        .then(cell => {
          dispatch(insertNetworkCell(cell));
          fetch('/api/leader', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...insertedMember, cellId: cell._id })
          }).then(res => {
            onToggleModal({});
            return res.json();
          }).then(() => {
            window.location.href = window.location.href;
          });
        });
    }
  };

  const handleChange = (key, value) => {
    const map = { cellNameKr: setIsEmptyCellName, name: setIsEmptyNetworkLeaderName, age: setIsEmptyAge };
    if (value.trim() !== '') {
      map[key] && map[key](false);
    }
    dispatch(insertMemberData(key, value));
  };

  const renderMembersList = (list) => {
    return list.map((member, i) => {
      return (
        <div key={i}>
          <div style={{ fontSize: '14px' }}>셀원 {i + 1}</div>
          <div className="addMember-wrap">
            <div>이름</div>
            <input
              className="cellMember add-form__right--member"
              name="members"
              onChange={evt => handleChangeMember('name', evt, i)} />
            <div>나이</div>
            <input
              className="cellMember add-form__right--member"
              name="members"
              onChange={evt => handleChangeMember('age', evt, i)} />
            <button className="btn btn-outline-dark add-form__btn--cell" onClick={handleRemoveMember(i)}>삭제</button>
          </div>
        </div>
      );
    });
  };

  const handleRemoveMember = idx => e => {
    dispatch(removeCellMember(idx));
  };

  const handleChangeMember = (key, evt, idx) => {
    dispatch(insertCellMember(key, evt.target.value, idx));
  };

  const handleAddMember = () => {
    dispatch(insertCellMember('', '', insertedMember.members.length));
  };

  const isEmptyError = ({ obj }) => {
    for (const value in obj) {
      if (obj[value]) return true;
    }
    return false;
  };

  return (
    <div className="add-form">
      <div className="add-form__icon"><FontAwesomeIcon icon={faAddressCard} /><h4>네트워크 추가</h4></div>
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
          <input className={`add-form__right--input ${isEmptyCellName && 'empty'}`} name="cellNameKr" onChange={({ target }) => handleChange(target.name, target.value)} />
        </div>
        <div className="add-form__box">
          <div className="add-form__left">성별</div>
          <div className="btn-group btn-group-toggle" data-toggle="buttons">
            <label className="btn btn-secondary select__btn--gender">
              <input onClick={e => handleChange(e.target.name, e.target.id)} type="radio" name="gender" id="male" autoComplete="off" />남</label>
            <label className="btn btn-secondary select__btn--gender">
              <input onClick={e => handleChange(e.target.name, e.target.id)} type="radio" name="gender" id="female" autoComplete="off" /> 여</label>
          </div>

        </div>
        <div className="add-form__box">
          <div className="add-form__left">네트워크리더</div>
          <input className={`add-form__right--input ${isEmptyNetworkLeaderName && 'empty'}`} name="name" onChange={({ target }) => handleChange(target.name, target.value)} />
        </div>
        <div className="add-form__box">
          <div className="add-form__left">나이</div>
          <input className={`add-form__right--input ${isEmptyAge && 'empty'}`} name="age" onChange={({ target }) => handleChange(target.name, target.value)}></input>
        </div>
        {renderMembersList(insertedMember.members)}
        <button className="btn btn-outline-dark add-member" onClick={() => handleAddMember()}>셀원 추가</button>
        <div className="add-form__bottom">
          <button className="btn btn-outline-dark add_member_btn add-form__btn--bottom" onClick={() => addNetworkCell({ isAddNetwork })}>등록</button>
          <button className="btn btn-outline-dark add-form__btn--bottom" onClick={onToggleModal}>닫기</button>
        </div>
        <div className={`add-form__empty-alert ${isEmptyError({ obj: { isEmptyAge, isEmptyNetworkLeaderName, isEmptyCellName } }) && 'active'}`}>빨간색 네모 안을 입력하세요 :)</div>
      </div>
    </div>
  );
};


export default AddNetworkForm;