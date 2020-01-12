import React, { Component } from 'react';
import './AddForm.scss';
import { connect } from 'react-redux';
import { changeCurrentSection, insertMemberData, insertCellMember, removeCellMember, initMemberData, insertedMember } from '../../store/modules/checker';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';

class SheetForm extends Component {

  componentDidMount() {
    // const { cellInfo } = this.props;
    this.handleChange('attached', this.props.attached);
    // this.handleChange('section', this.props.section);
    // if (!cellInfo) return;
    // this.initInsertedMember({ info: cellInfo, wish: ['cellNameKr', 'cellName', 'section', 'gender'], fn: this.handleChange });
  };

  componentWillUnmount() {
    this.props.initMemberData();
  };

  handleChange = (key, value) => {
    this.props.insertMemberData(key, value);
  }

  initInsertedMember = ({ info, wish, fn }) => {
    wish.forEach(item => {
      fn(item, info[item]);
    })
  };

  addSheet = () => {
    const { onToggleModal, insertedMember: { name, attached, section } } = this.props;
    console.log(name, attached, section);
    fetch('/api/sheet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, attached, section })
    }).then(res => {
      onToggleModal({ action: 'addSheet' });
      return res.json();
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
            <div className="add-form__right">{attached === 'holy' ? 'HOLY 청년부' : '벧엘 청년부'}</div>
          </div>
          <div className="add-form__box">
            <div className="add-form__left">지역군</div>
            <input className="add-form__right--input" name="section" onChange={({ target }) => this.handleChange(target.name, target.value)} />
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
  section: state.checker.section
})

const mapDispatchToProps = dispatch => ({
  insertMemberData: (left, value) => dispatch(insertMemberData(left, value)),
  insertCellMember: (left, right, idx) => dispatch(insertCellMember(left, right, idx)),
  removeCellMember: (idx) => dispatch(removeCellMember(idx)),
  changeCurrentSection: (section, enName) => dispatch(changeCurrentSection(section, enName)),
  initMemberData: () => dispatch(initMemberData())
})

export default connect(mapStateToProps, mapDispatchToProps)(SheetForm);