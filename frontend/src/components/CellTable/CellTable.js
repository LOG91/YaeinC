import React, { Component } from 'react';
import './CellTable.scss';
import { indexing, checkWorship, chageCurrentSection } from '../../store/modules/counter';
import { connect } from 'react-redux';

import { mapNetworkTable } from './Fn'


class CellTable extends Component{

  mapped = (list) => {
    console.log(list,1111111);
    return list.map(v => <div>{v.name}</div>);
  }
  

  handleCheck = async (leaderName, kind, sectionIdx, memberName = false) => {
    console.log(leaderName, kind, sectionIdx);
    const ff = await fetch(`/api/check/${memberName}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ leaderName, kind, memberName})
    });
    if(ff.status === 200) {
      this.props.checkWorship(sectionIdx, leaderName, kind);
    }
  }
  
  render(){
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
              {mapNetworkTable(this.props.currentSection, this.handleCheck)}
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
  checkWorship: (sectionIdx, name, left) => dispatch(checkWorship(sectionIdx, name, left)),
  chageCurrentSection: section => dispatch(chageCurrentSection(section))
});

export default connect(mapStateToProps, mapDispatchToProps)(CellTable);
