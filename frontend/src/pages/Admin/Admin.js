import React, { Component } from 'react';
import { connect } from 'react-redux'
import { insertMember, insertCellMember, removeCellMember } from '../../store/modules/counter'
import ReactDOM from 'react-dom';
import { CellTable } from '../../components/CellTable';
import Tab from '../../components/Tab/Tab';
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
        <Tab isAdmin={true} />
        <CellTable isAdmin={true} />
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