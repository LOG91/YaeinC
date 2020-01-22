import React, { Component } from 'react';
import './AddForm.scss';
import { connect } from 'react-redux';
import { insertMemberData, insertCellMember, removeCellMember, initMemberData, currentSheetId, networkCells, changeCurrentInfo, insertNetworkCell } from '../../store/modules/checker';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';

class AddForm extends Component {

  componentDidMount() {
    const { cellInfo } = this.props;
    this.handleChange('attached', this.props.attached);
    this.handleChange('section', this.props.section);
    if (!cellInfo) return;
    this.initInsertedMember({ info: cellInfo, wish: ['cellNameKr', 'cellName', 'section', 'gender'], fn: this.handleChange });
  }
  componentWillUnmount() {
    this.props.initMemberData();
  }

  initInsertedMember = ({ info, wish, fn }) => {
    wish.forEach(item => {
      fn(item, info[item]);
    })
  }
  addNetworkCell = async () => {
    const { insertedMember, onToggleModal, currentSheetId, cellInfo, networkCells, changeCurrentInfo, insertNetworkCell } = this.props;
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
      const networkCellsNames = networkCells.map(v => v.name);
      console.log(networkCellsNames, 19090);
      fetch(`/api/cells/${JSON.stringify(networkCellsNames)}`)
        .then(res => res.json())
        .then(cells => {

        });
    });


    if (!cellInfo) {
      await fetch('api/networkCell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: insertedMember.cellNameKr, networkLeaderName: insertedMember.name, gender: insertedMember.gender, attached: insertedMember.attached, sheetId: currentSheetId })
      }).then(res => res.json())
        .then(cell => {
          insertNetworkCell(cell);
          console.log(networkCells);
          const networkCellsNames = [...networkCells.map(v => v.name), cell.name];
          console.log(networkCellsNames);
          fetch(`/api/cells/${JSON.stringify(networkCellsNames)}`)
            .then(res => res.json())
            .then(cell => {
              changeCurrentInfo('currentSection', cell);
            });
        });

    }
  }

  handleChange = (key, value) => {
    this.props.insertMemberData(key, value);
  }

  renderMembersList(list) {
    return list.map((member, i) => {
      return (
        <div key={i}>
          <div style={{ fontSize: '14px' }}>셀원 {i + 1}</div>
          <div className="addMember-wrap">
            <div>이름</div>
            <input
              className="cellMember add-form__right--member"
              name="members"
              onChange={evt => this.handleChangeMember('name', evt, i)} />
            <div>나이</div>
            <input
              className="cellMember add-form__right--member"
              name="members"
              onChange={evt => this.handleChangeMember('age', evt, i)} />
            <button className="btn btn-outline-dark add-form__btn--cell" onClick={evt => this.handleRemoveMember(evt, i)}>삭제</button>
          </div>
        </div>
      )
    })
  }

  handleRemoveMember = (evt, idx) => {
    this.props.removeCellMember(idx)
  }

  handleChangeMember = (key, evt, idx) => {
    this.props.insertCellMember(key, evt.target.value, idx);
  }

  handleAddMember = () => {
    this.props.insertCellMember('', '', this.props.insertedMember.members.length);
  }

  render() {
    const { onToggleModal, attached, insertedMember, section, cellInfo } = this.props;
    console.log('셀인포', cellInfo);
    return (
      <div className="add-form">
        <div className="add-form__icon"><FontAwesomeIcon icon={faAddressCard} /><h4>{cellInfo ? '리더 추가' : '네트워크 추가'}</h4></div>
        <div>
          <div className="add-form__box">
            <div className="add-form__left">소속</div>
            <div className="add-form__right">{attached === 'holy' ? 'HOLY 청년부' : '벧엘 청년부'}</div>
          </div>
          <div className="add-form__box">
            <div className="add-form__left">지역군</div>
            <div className="add-form__right">{section}</div>
          </div>
          <div className="add-form__box">
            <div className="add-form__left">셀</div>
            {cellInfo ?
              (<div className="add-form__right">{insertedMember.cellNameKr}</div>)
              : (<input className="add-form__right--input" name="cellNameKr" onChange={({ target }) => this.handleChange(target.name, target.value)} />)}
          </div>
          <div className="add-form__box">
            <div className="add-form__left">성별</div>
            {cellInfo ?
              (<div className="add-form__right">{insertedMember.gender === 'male' ? '남' : '여'}</div>)
              : (<div class="btn-group btn-group-toggle" data-toggle="buttons">
                <label class="btn btn-secondary select__btn--gender">
                  <input onClick={e => this.handleChange(e.target.name, e.target.id)} type="radio" name="gender" id="male" autocomplete="off" />남</label>
                <label class="btn btn-secondary select__btn--gender">
                  <input onClick={e => this.handleChange(e.target.name, e.target.id)} type="radio" name="gender" id="female" autocomplete="off" /> 여</label>
              </div>)
            }
          </div>
          <div className="add-form__box">
            <div className="add-form__left">{cellInfo ? '리더' : '네트워크리더'}</div>
            <input className="add-form__right--input" name="name" onChange={({ target }) => this.handleChange(target.name, target.value)} />
          </div>
          <div className="add-form__box">
            <div className="add-form__left">나이</div>
            <input className="add-form__right--input" name="age" onChange={({ target }) => this.handleChange(target.name, target.value)}></input>
          </div>
          {this.renderMembersList(this.props.insertedMember.members)}
          <button className="btn btn-outline-dark add-member" onClick={() => this.handleAddMember()}>셀원 추가</button>
          <div className="add-form__bottom">
            <button className="btn btn-outline-dark add_member_btn add-form__btn--bottom" onClick={() => this.addNetworkCell()}>등록</button>
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
  currentSheetId: state.checker.currentSheetId,
  networkCells: state.checker.networkCells
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