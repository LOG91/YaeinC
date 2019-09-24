import React, { Component } from 'react';
import './AddForm.scss';
import { connect } from 'react-redux';
import { insertMember, insertCellMember, removeCellMember, idx, chageCurrentSection } from '../../store/modules/counter';
import { cellData } from '../../data/cellData';

class AddForm extends Component {

  componentDidMount() {
    const { cellInfo } = this.props;
    this.handleChange('cellNameKr', cellInfo.cellNameKr);
    this.handleChange('cellName', cellInfo.cellName);
    this.handleChange('section', cellInfo.section);
    this.handleChange('gender', cellInfo.gender);
    
  }
  async addLeader() {
    const { insertedMember, onToggleModal, cellIndex, idx, chageCurrentSection } = this.props;
    console.log(cellIndex)
    await fetch('/api/leader', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(insertedMember),
    }).then(res => {
      onToggleModal();
      return res.json();
    }).then(async res=> {
      const initCells = cellData.find(v => v.en_name === idx).cells;
      const currentCells = await fetch(`/api/cells/${JSON.stringify(initCells)}`).then(res => res.json());
      chageCurrentSection(currentCells);
    });
  }

  handleChange = (key, value) => {
    this.props.insertMember(key, value);
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
    const { onToggleModal, cellInfo, cellIndex } = this.props;
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
  insertedMember: state.insertedMember,
  idx: state.idx,
})

const mapDispatchToProps = dispatch => ({
  insertMember: (left, value) => dispatch(insertMember(left, value)),
  insertCellMember: (member, idx) => dispatch(insertCellMember(member, idx)),
  removeCellMember: (idx) => dispatch(removeCellMember(idx)),
  chageCurrentSection: (section, enName) => dispatch(chageCurrentSection(section, enName))
})

export default connect(mapStateToProps, mapDispatchToProps)(AddForm);