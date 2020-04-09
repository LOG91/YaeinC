import React, { useEffect } from 'react';
import './AddForm.scss';
import { connect, useDispatch, useSelector } from 'react-redux';
import { changeCurrentInfo, insertNetworkCell } from '../../store/modules/checker';
import { insertMemberData, insertCellMember, initMemberData, removeCellMember } from '../../store/modules/inserted';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';

const AddForm = (props) => {
  const { cellInfo, attached, insertMemberData, insertedMember, onToggleModal, currentSheetId, networkCells, changeCurrentInfo, insertNetworkCell } = props;
  const emptyWarning = useSelector(state => state.inserted.emptyWarning);
  const dispatch = useDispatch(null);

  useEffect(() => {
    insertMemberData('attached', attached);
    insertMemberData('leader_id', cellInfo._id);
    insertMemberData('cellNameKr', cellInfo.name);

    if (!cellInfo) return;
    initInsertedMember({ info: cellInfo, wish: ['cellName', 'section', 'gender'], fn: insertMemberData });
    return () => {
      props.initMemberData();
      dispatch({ type: 'ALL_OUT_EMPTY' });
    };
  }, []);

  const initInsertedMember = ({ info, wish, fn }) => {
    wish.forEach(item => {
      fn(item, info[item]);
    });
  };

  // const renderMembersList = (list) => {
  //   return list.map((member, i) => {
  //     return (
  //       <div key={i}>
  //         <div style={{ fontSize: '14px' }}>셀원 {i + 1}</div>
  //         <div className="addMember-wrap">
  //           <div>이름</div>
  //           <input
  //             className="cellMember add-form__right--member"
  //             name="members"
  //             onChange={evt => handleChangeMember('name', evt, i)} />
  //           <div>나이</div>
  //           <input
  //             className="cellMember add-form__right--member"
  //             name="members"
  //             onChange={evt => handleChangeMember('age', evt, i)} />
  //           <button className="btn btn-outline-dark add-form__btn--cell" onClick={handleRemoveMember(i)}>삭제</button>
  //         </div>
  //       </div>
  //     )
  //   })
  // }
  const onChangeData = ({ target }) => {
    console.log(target);
    target.value !== '' ? dispatch({ type: 'OUT_EMPTY', target: target.name }) : null;
    insertMemberData(target.name, target.value);
  };



  const { section, confirmAction } = props;
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
          <input className={`add-form__right--input ${emptyWarning.age ? 'empty' : ''}`} name="age" onChange={({ target }) => insertMemberData(target.name, target.value)}></input>
        </div>
        <div className="add-form__bottom">
          <button className="btn btn-outline-dark add_member_btn add-form__btn--bottom" onClick={() => confirmAction({ insertedMember })}>등록</button>
          <button className="btn btn-outline-dark add-form__btn--bottom" onClick={onToggleModal}>닫기</button>
        </div>
      </div>
    </div >
  );

}

const mapStateToProps = state => ({
  insertedMember: state.inserted.insertedMember,
  attached: state.checker.attached,
  section: state.checker.section,
  currentSheetId: state.checker.currentSheetId,
  networkCells: state.checker.networkCells,
})

const mapDispatchToProps = dispatch => ({
  insertMemberData: (left, value) => dispatch(insertMemberData(left, value)),
  insertCellMember: (left, right, idx) => dispatch(insertCellMember(left, right, idx)),
  removeCellMember: (idx) => dispatch(removeCellMember(idx)),
  initMemberData: () => dispatch(initMemberData()),
  changeCurrentInfo: (left, right) => dispatch(changeCurrentInfo(left, right)),
  insertNetworkCell: addedNetworkCell => dispatch(insertNetworkCell(addedNetworkCell))
})

export default connect(mapStateToProps, mapDispatchToProps)(AddForm);