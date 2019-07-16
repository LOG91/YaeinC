import React, { Component } from 'react';
import './CellTable.scss';
import { indexing, checkWorship, chageCurrentSection } from '../../store/modules/counter';
import { connect } from 'react-redux';

import { mapNetworkTable } from './Fn'


class CellTable extends Component{
  state = {
    currentTables: [],
    ct2: []
  }
  
  async componentDidMount() {
    const { chageCurrentSection } = this.props;
    const initCells = ['israel_ga', 'israel_na', 'israel_da'];
    const info = await Promise.all(initCells.map(item => fetch(`/api/section/${item}`).then(res=>res.json())));
    chageCurrentSection(info);
  }
  re = async (section) => {
    const f = await fetch(`/api/section/${section}`).then(res => res.json()).catch(error => console.error(error));
    this.setState({ ct2: f });
    // return res;
  }
  mapped = (list) => {
    console.log(list,1111111);
    return list.map(v => <div>{v.name}</div>);
  }
  // handleChange = (high, low, checkType, currentCellName) => {
  //   const { check } = this.props;
  //   check(high, low, checkType, currentCellName);
  // };
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
    const { ct2 } = this.state;
    const currentCellName = this.props.to.slice(1);
    const currentMembers = this.props.members[currentCellName];
    // const checkWorship =
    console.log('here');
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






{/* <Fragment key={idx}>
      {idx === 0 ? <td rowSpan={all_members + 1} className={ev ? "i2" : null}>{cellName}</td> : null}
      <tr className={ev ? "i2" : null}>
        <td rowSpan={MEMBER_CNT}>{member.name}</td>
        <td rowSpan={MEMBER_CNT}>
          <select className="select_box_dawn">
            <option value="zero">0</option>
            <option value="one">1</option>
            <option value="two">2</option>
            <option value="three">3</option>
            <option value="four">4</option>
            <option value="five">5</option>
          </select>
        </td>
        <td rowSpan={MEMBER_CNT}>
          <select className="select_box_word">
            <option value="zero">0</option>
            <option value="one">1</option>
            <option value="two">2</option>
          </select>
        </td>
        <td rowSpan={MEMBER_CNT}>
          <input className="styled-checkbox" checked={member.cc} readOnly type="checkbox" />
          <label onClick={() => onChange(index, idx, 'cc', currentCellName)} />
        </td>
        <td rowSpan={MEMBER_CNT}>
          <input className="styled-checkbox" checked={member.mc} readOnly type="checkbox" />
          <label onClick={() => onChange(index, idx, 'mc', currentCellName)} />
        </td>
        <td rowSpan={MEMBER_CNT}>
          <input className="styled-checkbox" checked={member.yc} readOnly type="checkbox" />
          <label onClick={() => onChange(index, idx, 'yc', currentCellName)} />
        </td>
      </tr>
      {MEMBER_CNT !== 1 ? member.members.map((v, i) =>(
        <tr key={i} className={ev ? "i2" : null}>
          <td rowSpan="1" key={i}>{v}</td>
          <td rowSpan="1">
            <input className="styled-checkbox" id="styled-checkbox-1" type="checkbox" value="value1" />
            <label htmlFor="styled-checkbox-1"></label>
          </td>
          <td rowSpan="1">
            <input className="styled-checkbox" id="styled-checkbox-1" type="checkbox" value="value1" />
            <label htmlFor="styled-checkbox-1"></label>
          </td>
          <td rowSpan="1">
            <input className="styled-checkbox" id="styled-checkbox-1" type="checkbox" value="value1" />
            <label htmlFor="styled-checkbox-1"></label>
          </td>
        </tr>
      )): (
      null)}
      </Fragment> */}