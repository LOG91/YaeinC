import React, { Component } from 'react';
import './CellTable.scss';
import { indexing, checkWorship, checkMemberWorship ,countContent ,chageCurrentSection } from '../../store/modules/counter';
import { connect } from 'react-redux';

import { mapNetworkTable } from './Fn'
import { cellData } from '../../data/cellData';


class CellTable extends Component{

  async componentDidMount() {
    const { current: currentCells, chageCurrentSection, indexing } = this.props;
    if (currentCells === '/') return;
    const initNetwork = cellData.find(v => v.path === currentCells);
    const initCells = initNetwork.cells;
    indexing(initNetwork.en_name);
    const info = await fetch(`/api/cells/${JSON.stringify(initCells)}`).then(res => res.json());
    chageCurrentSection(info);
  }

  handleCheck = async (id, sectionIdx, kind, memberName = false) => {
    console.log(id, '아이디');
    const responsedData = await fetch(`/api/check/leader/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, kind, memberName})
    });

    if(responsedData.status === 200) {
      this.props.checkWorship(id, sectionIdx, kind);
    }
  }
  handleCheckMember = async (leaderId, id, sec, sectionIdx, kind) => {
    const responsedData = await fetch(`/api/check/member/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, kind })
    });

    if(responsedData.status === 200) {
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
    if(responsedData.status === 200) {
      this.props.countContent(id, sectionIdx, kind, Number(count));
    }
  }
  
  render(){
    console.log(this.props.currentSection);
    return (
      <table border="1" cellPadding="10">
            <tbody>
              <tr>
                <th rowSpan="2" className="leader_name_header" onClick={() => this.re('israel')}>이스라엘군</th>
                <th rowSpan="2" className="leader_name_header">리더</th>
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
              {mapNetworkTable(this.props.currentSection, this.handleCheck, this.handleCount, this.handleCheckMember)}
            </tbody>
          </table>
    )
  }
}


const mapStateToProps = (state) => ({
  members: state.members,
  idx: state.idx,
  currentSection: state.currentSection
});

const mapDispatchToProps = dispatch => ({
  indexing: idx => dispatch(indexing(idx)),
  checkWorship: (name, sectionIdx, left) => dispatch(checkWorship(name, sectionIdx, left)),
  checkMemberWorship: (leaderId, id, sec, sectionIdx, left) => dispatch(checkMemberWorship(leaderId, id, sec, sectionIdx, left)),
  countContent: (name, sectionIdx, left, count) => dispatch(countContent(name, sectionIdx, left, count)),
  chageCurrentSection: section => dispatch(chageCurrentSection(section))
});

export default connect(mapStateToProps, mapDispatchToProps)(CellTable);
