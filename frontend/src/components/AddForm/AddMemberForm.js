import React, { Component } from 'react';
import './AddForm.scss';
import { connect } from 'react-redux';
import { changeCurrentInfo, insertNetworkCell } from '../../store/modules/checker';
import { insertMemberData, insertCellMember, initMemberData, removeCellMember } from '../../store/modules/inserted';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';

class AddForm extends Component {

  componentDidMount() {
    const { cellInfo, insertMemberData, attached } = this.props;
    insertMemberData('attached', attached);
    insertMemberData('leader_id', cellInfo._id);
    // insertMemberData('section', this.props.section);
    console.log(cellInfo);
    if (!cellInfo) return;
    this.initInsertedMember({ info: cellInfo, wish: ['cellNameKr', 'cellName', 'section', 'gender'], fn: insertMemberData });
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
    const { insertedMember, onToggleModal, currentSheetId, networkCells, changeCurrentInfo, insertNetworkCell } = this.props;
    await fetch('/api/leader', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(insertedMember),
    }).then(res => {
      onToggleModal({});
      return res.json();
    }).then(async leader => {
      if (!isAddNetwork) {
        window.location.href = window.location.href;
      }
    });

    if (isAddNetwork) {
      await fetch('/api/networkCell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: insertedMember.cellNameKr, networkLeaderName: insertedMember.name, gender: insertedMember.gender, attached: insertedMember.attached, sheetId: currentSheetId })
      }).then(res => res.json())
        .then(cell => {
          insertNetworkCell(cell);
          const networkCellsNames = [...networkCells.map(v => v.name), cell.name];
          fetch(`/api/cells/${JSON.stringify(networkCellsNames)}`)
            .then(res => res.json())
            .then(cell => {
              changeCurrentInfo('currentSection', cell);
            });
        });

    }
  }


  render() {
    const { onToggleModal, attached, insertMemberData, insertedMember, section, cellInfo, isAddNetwork, confirmAction } = this.props;
    console.log(isAddNetwork);
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
            <input className="add-form__right--input" name="name" onChange={({ target }) => insertMemberData(target.name, target.value)}></input>
          </div>
          <div className="add-form__box">
            <div className="add-form__left">나이</div>
            <input className="add-form__right--input" name="age" onChange={({ target }) => insertMemberData(target.name, target.value)}></input>
          </div>
          <div className="add-form__bottom">
            <button className="btn btn-outline-dark add_member_btn add-form__btn--bottom" onClick={() => confirmAction({ insertedMember })}>등록</button>
            <button className="btn btn-outline-dark add-form__btn--bottom" onClick={onToggleModal}>닫기</button>
          </div>
        </div>
      </div>
    )
  }

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