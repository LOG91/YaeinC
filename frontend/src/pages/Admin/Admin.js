import React, { Component } from 'react';
import { connect } from 'react-redux'
import { insertMember, insertCellMember, removeCellMember } from '../../store/modules/counter'
import ReactDOM from 'react-dom';
import './Admin.scss'

class AdminPage extends Component {
  
  async addLeader () {
    const { insertedMember } = this.props;
    await fetch('/api/leader', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(insertedMember),
    }).then(res => res.json());
  }

  handleChange = ({ target }) => {
    this.props.insertMember(target.name, target.value);
  }
  handleChangeGender = (evt) => {
    console.log(evt.target.name);
    this.props.insertMember('gender', evt.target.name);
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
  
  render(){
    return (
      <div>
        <div>
          <div>이름</div><input name="name" onChange={this.handleChange}></input>
          <div>나이</div><input name="age" onChange={this.handleChange}></input>
          <div className="radios">
            <div className="radio">
              <input
                type="radio"
                id="radio1"
                name="male"
                onChange={this.handleChangeGender}
                checked={this.props.insertedMember.gender ==='male' ? true : false}
              />
              <label htmlFor="radio1">
                형제
              </label>
            </div>
            <div className="radio">
              <input
                type="radio"
                id="radio2"
                name="female"
                onChange={this.handleChangeGender}
                checked={this.props.insertedMember.gender ==='female' ? true : false}
              />
              <label htmlFor="radio2">
                자매
              </label>
            </div>
          </div>
          <div>지역군</div><input name="section" onChange={this.handleChange}></input>
          <div>셀이름(en)</div><input name="cellName" onChange={this.handleChange}></input>
          <div>셀이름(kr)</div><input name="cellNameKr" onChange={this.handleChange}></input>
          {this.renderMembersList(this.props.insertedMember.members)}
          <button onClick={() => this.handleAddMember()}>셀원 추가</button>
        </div>
        <button className="add_member_btn" onClick={() => this.addLeader()}>등록</button>
      </div>
    )
  }
  
}

const mapStateToProps = state => ({
  insertedMember: state.insertedMember
})

const mapDispatchToProps = dispatch => ({
  insertMember: (left, value) => dispatch(insertMember(left, value)),
  insertCellMember: (member, idx) => dispatch(insertCellMember(member, idx)),
  removeCellMember: (idx) => dispatch(removeCellMember(idx))
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);