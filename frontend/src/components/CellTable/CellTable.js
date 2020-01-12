import React, { Component } from 'react';
import './CellTable.scss';
import { indexing, changeCurrentSection, checkWorship, checkMemberWorship, countContent, currentSheetId } from '../../store/modules/checker';
import { connect } from 'react-redux';

import renderCellList from './CellListTable'
import FortalModal from '../Modal/FortalModal';
import Modal from '../Modal/Modal';
import AddForm from '../AddForm/AddForm';

class CellTable extends Component {

  state = {
    modalOpend: false,
    clickedCellInfo: {},
    cellIndex: null
  }

  handleCheck = (id, sectionIdx, kind) => {
    fetch(`/api/check/leader/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, kind })
    }).then(responsedData => {
      if (responsedData.status === 200) {
        this.props.checkWorship(id, sectionIdx, kind);
      }
    });
  }

  handleCheckMember = async (leaderId, id, memberIdx, sectionIdx, kind) => {
    const responsedData = await fetch(`/api/check/leader/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, kind })
    });
    if (responsedData.status === 200) {
      this.props.checkMemberWorship(leaderId, id, memberIdx, sectionIdx, kind);
    }
  }

  handleCount = async (id, sectionIdx, kind, count) => {
    const responsedData = await fetch(`/api/count/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, kind, count: Number(count) })
    });
    if (responsedData.status === 200) {
      this.props.countContent(id, sectionIdx, kind, Number(count));
    }
  }

  handleToggleModal = param => {
    console.log(param);
    if (param) this.setState({ modalOpend: false });
    else this.setState({ modalOpend: !this.state.modalOpend })
  }

  handleAddLeader = (memberInfo, idx) => {
    this.handleToggleModal();
    this.setState({ clickedCellInfo: memberInfo, cellIndex: idx })
  }


  render() {
    const { isAdmin, currentSection } = this.props;
    console.log(currentSection, '커런트섹션');
    const { clickedCellInfo, cellIndex } = this.state;
    return (
      <table className={isAdmin ? "printArea cellTable" : "cellTable"} border="1" cellPadding="10">
        <tbody>
          <tr>
            <th rowSpan="2" className="section_name_header" onClick={() => this.re('israel')}>네트워크</th>
            <th rowSpan="2" className="leader_nam버e_header" onClick={this.onPrint}>리더</th>
            <th colSpan="5" className="leader_check_header">리더 체크리스트</th>
            <th rowSpan="2" className="cell_member_name_header">셀원</th>
            <th colSpan="3" className="cell_member_check_header">셀원 체크리스트</th>
          </tr>
          <tr>
            <td>새벽</td>
            <td>말씀</td>
            <td>셀</td>
            <td>주일</td>
            <td>청년</td>
            <td>셀</td>
            <td>주일</td>
            <td>청년</td>
          </tr>
          {renderCellList({
            isAdmin,
            currentSection,
            handleCheck: this.handleCheck,
            handleCount: this.handleCount,
            handleCheckMember: this.handleCheckMember,
            handleAddLeader: this.handleAddLeader,
          })}
        </tbody>
        {isAdmin ? (
          <div>
            <button className="btn btn-outline-dark networkName-box__button" onClick={() => this.handleAddLeader(null)}>네트워크 추가</button>
          </div>) : null}
        {this.state.modalOpend ?
          <FortalModal>
            <Modal onToggleModal={this.handleToggleModal}>
              <AddForm cellInfo={clickedCellInfo} cellIndex={cellIndex} />
            </Modal>
          </FortalModal> : null
        }
      </table>
    )
  }
}


const mapStateToProps = (state) => {
  return ({
    members: state.checker.members,
    idx: state.checker.idx,
    currentSection: state.checker.currentSection,
    currentSheetId: state.checker.currentSheetId
  })
};

const mapDispatchToProps = dispatch => ({
  indexing: idx => dispatch(indexing(idx)),
  checkWorship: (name, sectionIdx, left) => dispatch(checkWorship(name, sectionIdx, left)),
  checkMemberWorship: (leaderId, id, sec, sectionIdx, left) => dispatch(checkMemberWorship(leaderId, id, sec, sectionIdx, left)),
  countContent: (name, sectionIdx, left, count) => dispatch(countContent(name, sectionIdx, left, count)),
  changeCurrentSection: section => dispatch(changeCurrentSection(section))
});

export default connect(mapStateToProps, mapDispatchToProps)(CellTable);
