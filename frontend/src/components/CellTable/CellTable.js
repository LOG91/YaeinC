import React, { Component } from 'react';
import './CellTable.scss';
import { indexing, changeCurrentSection, checkWorship, checkMemberWorship, countContent } from '../../store/modules/checker';
import { connect } from 'react-redux';

import { mapNetworkTable } from './Fn'

import FortalModal from '../Modal/FortalModal';
import Modal from '../Modal/Modal';
import AddForm from '../AddForm/AddForm';

import { cellData } from '../../data/cellData';


class CellTable extends Component {

  async componentDidMount() {
    console.log(this.props);
    // const { current } = this.props;
    // if (current === '/') return;
    // const initCells = cellData.find(v => v.en_name === current).cells;
    // const currentCells = await fetch(`/api/cells/${JSON.stringify(initCells)}`).then(res => res.json());
    // this.setState( {currentSection: currentCells});
    // console.log(currentCells);
    // changeCurrentSection(currentCells);
    // console.log(current);
  }
  state = {
    openModal: false,
    clickedCellInfo: {},
    cellIndex: null
  }

  handleCheck = (id, sectionIdx, kind, memberName = false) => {
    console.log(id, sectionIdx, kind, memberName)
    // const responsedData =
    fetch(`/api/check/leader/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, kind, memberName })
    }).then(responsedData => {
      if (responsedData.status === 200) {
        this.props.checkWorship(id, sectionIdx, kind);
      }
    });

    
  }
  handleCheckMember = async (leaderId, id, sec, sectionIdx, kind) => {
    const responsedData = await fetch(`/api/check/member/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, kind })
    });

    if (responsedData.status === 200) {
      console.log(leaderId, id, sec, sectionIdx, kind);
      this.props.checkMemberWorship(leaderId, id, sec, sectionIdx, kind);
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

  handleToggleModal = () => {
    this.setState({ openModal: !this.state.openModal })
  }

  handleAddLeader = (memberInfo, idx) => {
    this.handleToggleModal();
    this.setState({ clickedCellInfo: memberInfo, cellIndex: idx })
  }


  render() {
    const { isAdmin } = this.props;
    return (
      <table className={isAdmin ? "printArea cellTable": "cellTable"} border="1" cellPadding="10">
        <tbody>
          <tr>
            <th rowSpan="2" className="section_name_header" onClick={() => this.re('israel')}>네트워크</th>
            <th rowSpan="2" className="leader_name_header" onClick={this.onPrint}>리더</th>
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
          {mapNetworkTable({
            currentSection: this.props.currentSection,
            handleCheck: this.handleCheck,
            handleCount: this.handleCount,
            handleCheckMember: this.handleCheckMember,
            handleAddLeader: this.handleAddLeader,
            isAdmin
          })}
        </tbody>
        {this.state.openModal ? (
          <FortalModal>
            <Modal>
              <AddForm cellInfo={this.state.clickedCellInfo} cellIndex={this.state.cellIndex} onToggleModal={this.handleToggleModal}/>
            </Modal>
          </FortalModal>
        ) : <div />}
      </table>
    )
  }
}


const mapStateToProps = (state) => {
  console.log(state);
  return({
  members: state.checker.members,
  seokki: 23,
  idx: state.checker.idx,
  currentSection: state.checker.currentSection
})};

const mapDispatchToProps = dispatch => ({
  indexing: idx => dispatch(indexing(idx)),
  checkWorship: (name, sectionIdx, left) => dispatch(checkWorship(name, sectionIdx, left)),
  checkMemberWorship: (leaderId, id, sec, sectionIdx, left) => dispatch(checkMemberWorship(leaderId, id, sec, sectionIdx, left)),
  countContent: (name, sectionIdx, left, count) => dispatch(countContent(name, sectionIdx, left, count)),
  changeCurrentSection: section => dispatch(changeCurrentSection(section))
});

export default connect(mapStateToProps, mapDispatchToProps)(CellTable);
