import React, { Component } from 'react';
import { connect } from 'react-redux'
import { insertMemberData, insertCellMember, removeCellMember } from '../../store/modules/registerer'
import { CellTable } from '../../components/CellTable';
import Tab from '../../components/Tab/Tab';
import './Admin.scss'

import { faPrint, faRainbow } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class AdminPage extends Component {

  async resetCheck() {
    // const { insertedMember } = this.props;
    const currentLocation = window.location.href;
    console.log(111);
    await fetch('/api/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentLocation })
    }).then(() => {
      window.location.href = window.location.href;
    });
  }


  handleChange = ({ target }) => {
    this.props.insertMemberData(target.name, target.value);
  }
  handleChangeGender = (evt) => {
    this.props.insertMemberData('gender', evt.target.name);
  }

  handlePrint() {
    const html = document.querySelector('html');
    const printContents = document.querySelector('.printArea').innerHTML;
    const printDiv = document.createElement("DIV");
    printDiv.className = "print-div";
    // const tabDiv = document.querySelector('.tab');
    // tabDiv.style.display = 'none';
    html.appendChild(printDiv);
    printDiv.innerHTML = printContents;
    document.body.style.display = 'none';
    window.print();
    document.body.style.display = 'block';
    printDiv.style.display = 'none';
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
    return (
      <div>
        <div className="edit-box">
          <div className="button-box"><button className="edit-box__button--print" onClick={this.handlePrint}>프린트</button></div>
          <div className="button-box"><button className="edit-box__button--init" onClick={this.resetCheck}>초기화</button></div>
        </div>
        <Tab isAdmin={true} />
        <div className="printArea"><CellTable isAdmin={true} /></div>
      </div>
    )
  }

}

const mapStateToProps = state => ({
  insertedMember: state.registerer.insertedMember
})

const mapDispatchToProps = dispatch => ({
  insertMemberData: (left, value) => dispatch(insertMemberData(left, value)),
  insertCellMember: (member, idx) => dispatch(insertCellMember(member, idx)),
  removeCellMember: (idx) => dispatch(removeCellMember(idx))
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);