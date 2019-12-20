import React, { Component } from 'react';
import './AddForm.scss';
import { connect } from 'react-redux';
import { changeCurrentSection, insertMemberData, insertCellMember, removeCellMember } from '../../store/modules/checker';
import { cellData } from '../../data/cellData';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';

class AddForm extends Component {

  componentDidMount() {
    const { cellInfo } = this.props;
    this.initData({ info: cellInfo, wish: ['cellNameKr', 'cellName', 'section', 'gender'], fn: this.handleChange });
  }

  initData = ({ info, wish, fn }) => {
    wish.forEach(item => {
      fn(item, info[item]);
    })
  }
  addLeader = async () => {
    const { insertedMember, onToggleModal, idx, changeCurrentSection } = this.props;
    await fetch('/api/leader', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(insertedMember),
    }).then(res => {
      onToggleModal();
      return res.json();
    }).then(async res => {
      console.log(idx);
      const initCells = cellData.find(v => v.en_name === idx).cells;
      console.log('이닛 셀스', initCells);
      console.log('셀데이타', cellData);
      const currentCells = await fetch(`/api/cells/${JSON.stringify(initCells)}`).then(res => res.json());
      changeCurrentSection(currentCells);
    });
  }

  handleChange = (key, value) => {
    this.props.insertMemberData(key, value);
  }

  renderMembersList(list) {
    return list.map((member, i) => {
      return (
        <div key={i}>
          <div className="addMember-wrap">
          <div style={{fontSize: '14px'}}>셀원 {i + 1}</div>
            <input
              className="cellMember add-form__right--input"
              name="members"
              onChange={evt => this.handleChangeMember(evt, i)} />
            <button className="btn btn-outline-dark add-form__btn--cell" onClick={evt => this.handleRemoveMember(evt, i)}>삭제</button>

          </div>
        </div>
      )
    })
  }

  handleRemoveMember = (evt, idx) => {
    this.props.removeCellMember(idx)
  }

  handleChangeMember = (evt, idx) => {
    this.props.insertCellMember(evt.target.value, idx);
  }

  handleAddMember = () => {
    this.props.insertCellMember("", this.props.insertedMember.members.length);
  }

  render() {
    const { onToggleModal, cellInfo } = this.props;
    return (
      <div className="add-form">
        <div className="add-form__icon"><FontAwesomeIcon icon={faAddressCard} /><h4>멤버 추가</h4></div>
        <div>

          <div className="add-form__box">
            <div className="add-form__left">지역군</div>
            <div className="add-form__right">{cellInfo.section}</div>
          </div>
          <div className="add-form__box">
            <div className="add-form__left">셀</div>
            <div className="add-form__right">{cellInfo.cellNameKr}</div>
          </div>
          <div className="add-form__box">
            <div className="add-form__left">이름</div>
            <input className="add-form__right--input" name="name" onChange={({ target }) => this.handleChange(target.name, target.value)} />
          </div>
          <div className="add-form__box">
            <div className="add-form__left">나이</div>
            <input className="add-form__right--input" name="age" onChange={({ target }) => this.handleChange(target.name, target.value)}></input>
          </div>
          {this.renderMembersList(this.props.insertedMember.members)}
          <button className="btn btn-outline-dark add-member" onClick={() => this.handleAddMember()}>셀원 추가</button>
          <div className="add-form__bottom">
            <button className="btn btn-outline-dark add_member_btn add-form__btn--bottom" onClick={() => this.addLeader()}>등록</button>
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
})

const mapDispatchToProps = dispatch => ({
  insertMemberData: (left, value) => dispatch(insertMemberData(left, value)),
  insertCellMember: (member, idx) => dispatch(insertCellMember(member, idx)),
  removeCellMember: (idx) => dispatch(removeCellMember(idx)),
  changeCurrentSection: (section, enName) => dispatch(changeCurrentSection(section, enName)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddForm);