import React, { Fragment, Component } from 'react';
import members from '../member';
import './CellTable.scss';

import { indexing } from '../store/modules/counter';
import { connect } from 'react-redux';

const member_list = list => {
  const reduced = list.map((member, idx) => {
    const MEMBER_CNT = member.members.length + 1;
    if(MEMBER_CNT===1) return (
      <Fragment key={idx}>
        <tr>
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
            <input className="styled-checkbox" id="styled-checkbox-1" type="checkbox" value="value1" />
            <label htmlFor="styled-checkbox-1"></label>
          </td>
          <td rowSpan={MEMBER_CNT}>
            <input className="styled-checkbox" id="styled-checkbox-2" type="checkbox" value="value2" />
            <label htmlFor="styled-checkbox-2"></label>
          </td>
          <td rowSpan={MEMBER_CNT}>
            <input className="styled-checkbox" id="styled-checkbox-3" type="checkbox" value="value3" />
            <label htmlFor="styled-checkbox-3"></label>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </Fragment>
    )
    return (
      <Fragment key={idx}>
      <tr>
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
          <input className="styled-checkbox" id="styled-checkbox-1" type="checkbox" value="value1" />
          <label htmlFor="styled-checkbox-1"></label>
        </td>
        <td rowSpan={MEMBER_CNT}>
          <input className="styled-checkbox" id="styled-checkbox-1" type="checkbox" value="value1" />
          <label htmlFor="styled-checkbox-1"></label>
        </td>
        <td rowSpan={MEMBER_CNT}>
          <input className="styled-checkbox" id="styled-checkbox-1" type="checkbox" value="value1" />
          <label htmlFor="styled-checkbox-1"></label>
        </td>
      </tr>
      {member.members.length ? member.members.map((v, i) =>(
        <tr key={i}>
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
      <tr>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
      </tr>)}
      </Fragment>
    )
  })
  return reduced;
}

class CellTable extends Component{
  render(){
    const current_idx = this.props.to.slice(1);
    const current_members = members[current_idx];
    console.log(current_members);
    return (
      <table border="1" cellPadding="10">
            <tbody>
              <tr>
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
              {current_members ? member_list(current_members) : <div>아직 데이터가 없습니다😨</div>}
            </tbody>
          </table>
    )
  }
}

const mapStateToProps = (state) => ({
  indexing: state.indexing
});

const mapDispatchToProps = dispatch => ({
  indexing: idx => dispatch(indexing(idx))
});

export default connect(mapStateToProps, mapDispatchToProps)(CellTable);