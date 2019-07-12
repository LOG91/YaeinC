import React, { Component } from 'react';
import { connect } from 'react-redux'
import { insertMember, insertCellMember } from '../store/modules/counter'
import ReactDOM from 'react-dom';


class AdminPage extends Component {
  componentDidMount() {
    // console.log(this.props.insertedMember);
  }
  async addMember() {
    const f = await fetch('/api/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.props.insertedMember),
    }).then(res => res.json());
  }
  handleChange = ({ target }) => {
    this.props.insertMember(target.name, target.value);
  }
  renderMembersList(list) {
    console.log(this.props.insertedMember);
    console.log(list, 999);
    // if (!list.length) list = [""];
    // return (
    //   <div>
    //     <div>셀원 1</div>
    //     <input
    //       className="cellMember"
    //       name="members"
    //       placeholder="셀원을 입력하세요"
    //       onChange={evt => this.handleChangeMember(evt, 0)}
    //     />
    //   </div>
    // )
    return list.map((member, i) => {
      return <div key={i}><div>셀원 {i + 1}</div><input className="cellMember" name="members" onChange={evt => this.handleChangeMember(evt, i)}></input></div>
    })
  }
  handleChangeMember = (evt, idx) => {
    console.log(evt.target.value, idx, 111);
    this.props.insertCellMember(evt.target.value, idx);
  }
  handleAddMember = () => {
    console.log(this.props.insertedMember.members.length);
    this.props.insertCellMember("", this.props.insertedMember.members.length);
  }
  render(){
    return (
      <div>
        <div>
          <div>이름</div><input name="name" onChange={this.handleChange}></input>
          <div>나이</div><input name="age" onChange={this.handleChange}></input>
          <div>지역군</div><input name="section" onChange={this.handleChange}></input>
          <div>셀이름</div><input name="cellName" onChange={this.handleChange}></input>
          {/* <div>셀원</div><input></input><button className="add_member_btn" onClick={() => addMember()}>추가</button> */}
          {this.renderMembersList(this.props.insertedMember.members)}
          <button onClick={() => this.handleAddMember()}>추가</button>
        </div>
        <button className="add_member_btn" onClick={() => this.addMember()}>등록</button>
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
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);