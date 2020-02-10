import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { insertMemberData, insertCellMember, removeCellMember, initMemberData, changeCurrentInfo } from '../../store/modules/checker';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { BasicDropDown } from '../DropDown';

const ChurchForm = ({ church, churches, attached, onToggleModal, handleChange, confirmAction }) => {
  const ATTACHED_LIST = ['청년', '장년', '오이코스'];

  const initData = () => {
    handleChange('attached', ATTACHED_LIST[0]);
  }
  useEffect(() => {
    initData();
    return () => initMemberData();
  }, []);


  return (
    <div className="add-form">
      <div className="add-form__icon"><FontAwesomeIcon icon={faFileAlt} /><h4>페이지 추가</h4></div>
      <div>
        <div className="add-form__box">
          <div className="add-form__left">페이지 이름</div>
          <input className="add-form__right--input" name="church" onChange={({ target }) => handleChange(target.name, target.value)} />
        </div>
        <div className="add-form__box">
          <div className="add-form__left">소속</div>
          <BasicDropDown kind="attached" list={ATTACHED_LIST} handler={handleChange} initialValue={attached} />
        </div>
        <div className="add-form__bottom">
          <button className="btn btn-outline-dark add_member_btn add-form__btn--bottom" onClick={() => confirmAction({ church, attached, churches })}>등록</button>
          <button className="btn btn-outline-dark add-form__btn--bottom" onClick={()=>onToggleModal({})}>닫기</button>
        </div>
      </div>
    </div>
  )
}


const mapStateToProps = state => ({
  insertedMember: state.inserted.insertedMember,
  attached: state.checker.attached,
  section: state.checker.section,
  church: state.checker.church,
  churches: state.checker.churches
})

const mapDispatchToProps = dispatch => ({
  insertMemberData: (left, value) => dispatch(insertMemberData(left, value)),
  insertCellMember: (left, right, idx) => dispatch(insertCellMember(left, right, idx)),
  removeCellMember: (idx) => dispatch(removeCellMember(idx)),
  initMemberData: () => dispatch(initMemberData()),
  changeCurrentInfo: (left, right) => dispatch(changeCurrentInfo(left, right))
})

export default connect(mapStateToProps, mapDispatchToProps)(ChurchForm);