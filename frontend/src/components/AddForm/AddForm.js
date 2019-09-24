import React, { Component } from 'react';
import './AddForm.scss';
import { connect } from 'react-redux';
import { changeCurrentSection, insertMemberData, insertCellMember, removeCellMember } from '../../store/modules/checker';
import { cellData } from '../../data/cellData';

class AddForm extends Component {

  componentDidMount() {
    const { cellInfo } = this.props;
    this.initData({info: cellInfo, wish: ['cellNameKr', 'cellName', 'section', 'gender'], fn: this.handleChange});
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
      const initCells = cellData.find(v => v.en_name === idx).cells;
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
          <div>셀원 {i + 1}</div>
          <input
            className="cellMember"
            name="members"
            onChange={evt => this.handleChangeMember(evt, i)} />
          <button onClick={evt => this.handleRemoveMember(evt, i)}>삭제</button>
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
        <h3>멤버 추가</h3>
        <div>
          <div className="add-form__box">
            <div>이름</div>
            <input name="name" onChange={({ target }) => this.handleChange(target.name, target.value)} />
          </div>
          <div className="add-form--alert">이름을 입력하세요</div>
          <div className="add-form__box"><div>나이</div><input name="age" onChange={({ target }) => this.handleChange(target.name, target.value)}></input></div>
          <div className="add-form__box">
            <div>지역군</div>
            <div>{cellInfo.section}</div>
          </div>
          <div className="add-form__box">
            <div>셀이름</div>
            <div>{cellInfo.cellNameKr}</div>
          </div>
          {this.renderMembersList(this.props.insertedMember.members)}
          <button onClick={() => this.handleAddMember()}>셀원 추가</button>
        </div>
        <button className="add_member_btn" onClick={() => this.addLeader()}>등록</button>
        <button onClick={onToggleModal}>닫기</button>
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
  changeCurrentSection: (section, enName) => dispatch(changeCurrentSection(section, enName))
})

export default connect(mapStateToProps, mapDispatchToProps)(AddForm);