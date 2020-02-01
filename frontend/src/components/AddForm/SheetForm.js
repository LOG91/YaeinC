import React, { Component } from 'react';
import './AddForm.scss';
import { connect } from 'react-redux';
import { changeCurrentInfo, insertMemberData, insertCellMember, removeCellMember, initMemberData, insertedMember, sheets } from '../../store/modules/checker';

import { BasicDropDown } from '../DropDown';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';

class SheetForm extends Component {

  componentDidMount() {
    this.initData();
  };

  componentWillUnmount() {
    this.props.initMemberData();
  };

  handleChange = (key, value) => {
    this.props.insertMemberData(key, value);
  }

  initData() {
    this.handleChange('attached', this.props.attached);
    this.handleChange('section', '이스라엘');
  }

  addSheet = () => {
    const { onToggleModal, insertedMember: { name, attached, section }, changeCurrentInfo, sheets } = this.props;
    fetch('http://localhost:7000/api/sheet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, attached, section })
    }).then(res => {
      onToggleModal({ action: 'addSheet' });
      return res.json();
    }).then(res => {
      changeCurrentInfo('sheets', [...sheets, res]);
    });
  }

  render() {
    const { onToggleModal, attached, insertedMember, section, cellInfo } = this.props;
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
            <BasicDropDown kind="section" list={['이스라엘', '아랍', '아시아']} handler={this.handleChange} initialValue={insertedMember.section} />
          </div>
          <div className="add-form__box">
            <div className="add-form__left">시트 이름</div>
            <input className="add-form__right--input" name="name" onChange={({ target }) => this.handleChange(target.name, target.value)} />
          </div>
          <div className="add-form__bottom">
            <button className="btn btn-outline-dark add_member_btn add-form__btn--bottom" onClick={() => this.addSheet()}>등록</button>
            <button className="btn btn-outline-dark add-form__btn--bottom" onClick={onToggleModal}>닫기</button>
          </div>
        </div>
      </div>
    )
  }

}

const mapStateToProps = state => ({
  insertedMember: state.checker.insertedMember,
  idx: state.checker.idx,
  attached: state.checker.attached,
  section: state.checker.section,
  sheets: state.checker.sheets
})

const mapDispatchToProps = dispatch => ({
  insertMemberData: (left, value) => dispatch(insertMemberData(left, value)),
  insertCellMember: (left, right, idx) => dispatch(insertCellMember(left, right, idx)),
  removeCellMember: (idx) => dispatch(removeCellMember(idx)),
  changeCurrentInfo: (left, right) => dispatch(changeCurrentInfo(left, right)),
  initMemberData: () => dispatch(initMemberData())
})

export default connect(mapStateToProps, mapDispatchToProps)(SheetForm);