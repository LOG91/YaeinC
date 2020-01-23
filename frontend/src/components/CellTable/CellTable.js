import React, { Component } from 'react';
import './CellTable.scss';
import { indexing, changeCurrentSection, checkWorship, checkMemberWorship, countContent, sheets } from '../../store/modules/checker';
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
    if (param) this.setState({ modalOpend: false });
    else this.setState({ modalOpend: !this.state.modalOpend })
  }

  handleAddLeader = (memberInfo, idx) => {
    this.handleToggleModal();
    this.setState({ clickedCellInfo: memberInfo, cellIndex: idx })
  }


  render() {
    const { isAdmin, currentSection, sheets } = this.props;
    const { clickedCellInfo, cellIndex } = this.state;
    return (
      <table className={isAdmin ? "print-area cell-table" : "cell-table"} border="1" cellPadding="10">
        <tbody>
          <tr>
            <th rowSpan="2" className="cell-table__th cell-table__th--section-name" onClick={() => this.re('israel')}>네트워크</th>
            <th rowSpan="2" className="cell-table__th cell-table__th--leader-name" onClick={this.onPrint}>리더</th>
            <th colSpan="5" className="cell-table__th cell-table__th--leader-check">리더 체크리스트</th>
            <th rowSpan="2" className="cell-table__th cell_member_name_header">셀원</th>
            <th colSpan="3" className="cell-table__th cell-table__th--member-check">셀원 체크리스트</th>
          </tr>
          <tr>
            <td className="cell-table__td">새벽</td>
            <td className="cell-table__td">말씀</td>
            <td className="cell-table__td">셀</td>
            <td className="cell-table__td">주일</td>
            <td className="cell-table__td">청년</td>
            <td className="cell-table__td">셀</td>
            <td className="cell-table__td">주일</td>
            <td className="cell-table__td">청년</td>
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
          <div className="networkName-box">
            {sheets.length > 0 ?
              (<button className="btn btn-outline-dark networkName-box__button" onClick={() => this.handleAddLeader(null)}>네트워크 추가</button>)
              : (<div>😰시트가 없습니다 시트를 먼저 추가하세요</div>)}
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
    sheets: state.checker.sheets
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
