import React, { Fragment } from 'react';
import { member } from '../member';
import './CellTable.scss';

const member_list = list => {
  const reduced = list.map(member => {
    const MEMBER_CNT = member.members.length + 1;
    if(MEMBER_CNT===1) return (
      <Fragment>
        <tr>
          <td rowSpan={MEMBER_CNT}>{member.name}</td>
          <td rowSpan={MEMBER_CNT}>
          <select class="select_box_dawn">
            <option value="zero">0</option>
            <option value="one">1</option>
            <option value="two">2</option>
            <option value="three">3</option>
            <option value="four">4</option>
            <option value="five">5</option>
          </select>
          </td>
          <td rowSpan={MEMBER_CNT}>
            <select class="select_box_word">
              <option value="zero">0</option>
              <option value="one">1</option>
              <option value="two">2</option>
            </select>
          </td>
          <td rowSpan={MEMBER_CNT}>
            <input class="styled-checkbox" id="styled-checkbox-1" type="checkbox" value="value1" />
            <label for="styled-checkbox-1"></label>
          </td>
          <td rowSpan={MEMBER_CNT}>
            <input class="styled-checkbox" id="styled-checkbox-2" type="checkbox" value="value2" />
            <label for="styled-checkbox-2"></label>
          </td>
          <td rowSpan={MEMBER_CNT}>
            <input class="styled-checkbox" id="styled-checkbox-3" type="checkbox" value="value3" />
            <label for="styled-checkbox-3"></label>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </Fragment>
    )
    return (
      <Fragment>
      <tr>
        <td rowSpan={MEMBER_CNT}>{member.name}</td>
        <td rowSpan={MEMBER_CNT}>
          <select class="select_box_dawn">
            <option value="zero">0</option>
            <option value="one">1</option>
            <option value="two">2</option>
            <option value="three">3</option>
            <option value="four">4</option>
            <option value="five">5</option>
          </select>
        </td>
        <td rowSpan={MEMBER_CNT}>
          <select class="select_box_word">
            <option value="zero">0</option>
            <option value="one">1</option>
            <option value="two">2</option>
          </select>
        </td>
        <td rowSpan={MEMBER_CNT}>
          <input class="styled-checkbox" id="styled-checkbox-1" type="checkbox" value="value1" />
          <label for="styled-checkbox-1"></label>
        </td>
        <td rowSpan={MEMBER_CNT}>
          <input class="styled-checkbox" id="styled-checkbox-1" type="checkbox" value="value1" />
          <label for="styled-checkbox-1"></label>
        </td>
        <td rowSpan={MEMBER_CNT}>
          <input class="styled-checkbox" id="styled-checkbox-1" type="checkbox" value="value1" />
          <label for="styled-checkbox-1"></label>
        </td>
      </tr>
      {member.members.length ? member.members.map((v, i) =>(
        <tr>
          <td rowspan="1" key={i}>{v}</td>
          <td rowspan="1">1</td>
          <td rowspan="1">1</td>
          <td rowspan="1">1</td>
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

export const CellTable = () => {
  return (
    <table border="1" cellpadding="10">
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
            {member_list(member)}
          </tbody>
        </table>
  )
}