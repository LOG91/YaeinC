import React, { Fragment } from 'react';
import { CheckBox } from '../CheckBox';

const renderCellList =
  ({ currentSection, handleCheck, handleCount, handleCheckMember, handleAddLeader, isAdmin }) => {
    if (!currentSection) return <div>아직 데이터가 없습니다😨</div>;

    const mappedByNetwork = currentSection.map((network, idx) => {
      const networkName = network.length ? network[0].cellNameKr : '';
      const tmp = makeCellBox({ network, idx, networkName, handleCheck, handleCount, handleCheckMember, handleAddLeader, isAdmin });
      return tmp;
    });
    return mappedByNetwork;
  };


const makeCellBox = ({ isAdmin, network, idx, networkName, handleCheck, handleCount, handleCheckMember, handleAddLeader,  }) => {
  const all_members = network.reduce((ac, cv) => {
    ac += cv.members.length;
    return ac;
  }, 0) + network.length;

  const evenClsName = (idx % 2 === 0) ? 'i2' : '';
  const reduced = network.map((leader, idxForKey) => {
    const MEMBER_CNT = leader.members.length + 1;
    return (
      <Fragment key={idxForKey}>
        {idxForKey === 0 ? (
          <tr className="networkName-box">
            <td
              rowSpan={all_members + 1}>
              <p>{networkName}</p>
              {isAdmin ? <button className="networkName-box__button" onClick={e => handleAddLeader(leader, idx)}>추가</button> : null}
            </td>
          </tr>
        ) : null}
        <tr className={evenClsName}>
          <td rowSpan={MEMBER_CNT}>{leader.name}</td>
          <td rowSpan={MEMBER_CNT}>
            <select
              className="select_box_dawn"
              onChange={({ target }) => handleCount(leader._id, idx, 'dawn', target.value)}
              value={leader.dawn}
            >

              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </td>
          <td rowSpan={MEMBER_CNT}>
            <select
              className="select_box_word"
              onChange={({ target }) => handleCount(leader._id, idx, 'word', target.value)}
              value={leader.word}
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </td>
          <td rowSpan={MEMBER_CNT}>
            <CheckBox checkedValue={leader.cc} onCheck={() => handleCheck(leader._id, idx, 'cc')} />
          </td>
          <td rowSpan={MEMBER_CNT}>
            <CheckBox checkedValue={leader.mc} onCheck={() => handleCheck(leader._id, idx, 'mc')} />
          </td>
          <td rowSpan={MEMBER_CNT}>
          <CheckBox checkedValue={leader.yc} onCheck={() => handleCheck(leader._id, idx, 'yc')} />
          </td>
        </tr>
        {MEMBER_CNT !== 1 ? leader.members.map((member, i) => (
          <tr key={i}>
            <td rowSpan="1" key={i} className={evenClsName}>{member.name}</td>
            <td rowSpan="1" className={evenClsName}>
              <CheckBox checkedValue={member.cc} onCheck={() => handleCheckMember(leader._id,member._id, member.sec, idx, 'cc')} />
            </td>
            <td rowSpan="1" className={evenClsName}>
            <CheckBox checkedValue={member.mc} onCheck={() => handleCheckMember(leader._id,member._id, member.sec, idx, 'mc')} />
            </td>
            <td rowSpan="1" className={evenClsName}>
            <CheckBox checkedValue={member.yc} onCheck={() => handleCheckMember(leader._id,member._id, member.sec, idx, 'yc')} />
            </td>
          </tr>
        )) : (
            null)}
      </Fragment>
    )
  })

  return reduced;
}

export default renderCellList;