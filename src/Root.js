import React, { Fragment } from 'react';
import './style.scss';
import { member } from './member';


const member_list = list => {
  const reduced = list.map(member => {
    const MEMBER_CNT = member.members.length + 1;
    if(MEMBER_CNT===1) return (
      <Fragment>
      <tr>
        <td rowSpan={MEMBER_CNT}>{member.name}</td>
        <td rowSpan={MEMBER_CNT}>5</td>
        <td rowSpan={MEMBER_CNT}>2</td>
        <td rowSpan={MEMBER_CNT}>2</td>
        <td rowSpan={MEMBER_CNT}>2</td>
        <td rowSpan={MEMBER_CNT}>2</td>
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
        <td rowSpan={MEMBER_CNT}>5</td>
        <td rowSpan={MEMBER_CNT}>2</td>
        <td rowSpan={MEMBER_CNT}>2</td>
        <td rowSpan={MEMBER_CNT}>2</td>
        <td rowSpan={MEMBER_CNT}>2</td>
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
const Root = () => {
  return (
    <div>
      <h3 className="title">Yaein Church</h3>
      <div className="container">
        <ul className="tab">
          <li className="index">이스라엘군</li>
          <li className="index">아랍군</li>
          <li className="index">연해주&터키군</li>
          <li className="index">청년예베(남)</li>
          <li className="index">청년예베(여)</li>
        </ul>
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
      </div>
    </div>
  )
}

export default Root;