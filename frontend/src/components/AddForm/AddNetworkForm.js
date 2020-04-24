import React, { Component } from 'react';
import './AddForm.scss';
import { connect } from 'react-redux';
import { changeCurrentInfo, insertNetworkCell } from '../../store/modules/checker';
import { insertMemberData, insertCellMember, initMemberData, removeCellMember } from '../../store/modules/inserted';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faSmileBeam } from '@fortawesome/free-solid-svg-icons';

class AddForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emptyCheck: {
        isEmptyCellName: false,
        isEmptyNetworkLeaderName: false,
        isEmptyAge: false
      }
    }
  }

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

  addNetworkCell = async ({ isAddNetwork }) => {
    const { insertedMember, onToggleModal, currentSheetInfo, insertNetworkCell } = this.props;

    this.setState({
      ...this.state,
      emptyCheck: {
        ...this.state.emptyCheck,
        isEmptyCellName: !insertedMember.cellNameKr,
        isEmptyNetworkLeaderName: !insertedMember.name,
        isEmptyAge: !insertedMember.age,
      }
    });

    if (insertedMember.cellNameKr.trim() !== '' && insertedMember.name.trim() !== '' && insertedMember.age.trim() !== '') {
      await fetch('/api/networkCell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: insertedMember.cellNameKr, networkLeaderName: insertedMember.name, gender: insertedMember.gender, attached: insertedMember.attached, sheetId: currentSheetInfo._id })
      }).then(res => res.json())
        .then(cell => {
          insertNetworkCell(cell);
          fetch('/api/leader', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...insertedMember, cellId: cell._id })
          }).then(res => {
            onToggleModal({});
            return res.json()
          }).then(leader => {
            window.location.href = window.location.href;
          })
        });

    }
  }

  handleChange = (key, value) => {
    const map = { cellNameKr: 'isEmptyCellName', name: 'isEmptyNetworkLeaderName', age: 'isEmptyAge' };
    if (value.trim() !== '') {
      this.setState({ ...this.state, emptyCheck: { ...this.state.emptyCheck, [map[key]]: false } })
    }
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
            <button className="btn btn-outline-dark add-form__btn--cell" onClick={this.handleRemoveMember(i)}>삭제</button>
          </div>
        </div>
      )
    })
  }

  handleRemoveMember = idx => e => {
    this.props.removeCellMember(idx);
  }

  handleChangeMember = (key, evt, idx) => {
    this.props.insertCellMember(key, evt.target.value, idx);
  }

  handleAddMember = () => {
    this.props.insertCellMember('', '', this.props.insertedMember.members.length);
  }

  isEmptyError = ({ obj }) => {
    for (const value in obj) {
      if (obj[value]) return true;
    }
    return false;
  }

  render() {
    const { onToggleModal, attached, insertedMember, section, cellInfo, isAddNetwork } = this.props;
    const { emptyCheck } = this.state;
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
            <input className={`add-form__right--input ${emptyCheck.isEmptyCellName && 'empty'}`} name="cellNameKr" onChange={({ target }) => this.handleChange(target.name, target.value)} />
          </div>
          <div className="add-form__box">
            <div className="add-form__left">성별</div>
            <div className="btn-group btn-group-toggle" data-toggle="buttons">
              <label className="btn btn-secondary select__btn--gender">
                <input onClick={e => this.handleChange(e.target.name, e.target.id)} type="radio" name="gender" id="male" autoComplete="off" />남</label>
              <label className="btn btn-secondary select__btn--gender">
                <input onClick={e => this.handleChange(e.target.name, e.target.id)} type="radio" name="gender" id="female" autoComplete="off" /> 여</label>
            </div>

          </div>
          <div className="add-form__box">
            <div className="add-form__left">네트워크리더</div>
            <input className={`add-form__right--input ${emptyCheck.isEmptyNetworkLeaderName && 'empty'}`} name="name" onChange={({ target }) => this.handleChange(target.name, target.value)} />
          </div>
          <div className="add-form__box">
            <div className="add-form__left">나이</div>
            <input className={`add-form__right--input ${emptyCheck.isEmptyAge && 'empty'}`} name="age" onChange={({ target }) => this.handleChange(target.name, target.value)}></input>
          </div>
          {this.renderMembersList(this.props.insertedMember.members)}
          <button className="btn btn-outline-dark add-member" onClick={() => this.handleAddMember()}>셀원 추가</button>
          <div className="add-form__bottom">
            <button className="btn btn-outline-dark add_member_btn add-form__btn--bottom" onClick={() => this.addNetworkCell({ isAddNetwork })}>등록</button>
            <button className="btn btn-outline-dark add-form__btn--bottom" onClick={onToggleModal}>닫기</button>
          </div>
          <div className={`add-form__empty-alert ${this.isEmptyError({ obj: this.state.emptyCheck }) && 'active'}`}>빨간색 네모 안을 입력하세요 :)</div>
        </div>
      </div>
    )
  }

}

const mapStateToProps = state => ({
  insertedMember: state.inserted.insertedMember,
  attached: state.checker.attached,
  section: state.checker.section,
  currentSheetInfo: state.checker.currentSheetInfo,
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