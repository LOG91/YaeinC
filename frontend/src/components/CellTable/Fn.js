import React, { Fragment } from 'react';

const renderLeaderList = ({ network, idx, networkName, handleCheck, handleCount, handleCheckMember, handleAddLeader, isAdmin }) => {
  const all_members = network.reduce((ac, cv) => {
    ac += cv.members.length;
    return ac;
  }, 0) + network.length;
  
  const evenClsName = (idx % 2 === 0) ? 'i2' : '';
  const reduced = network.map((member, idxForKey) => {
    const MEMBER_CNT = member.members.length + 1;
    return (
      <Fragment key={idxForKey}>
        {idxForKey === 0 ? (
          <tr className="networkName-box">
            <td
              rowSpan={all_members + 1}>
              <p>{networkName}</p>
              {isAdmin ? <button className="networkName-box__button" onClick={e => handleAddLeader(member, idx)}>추가</button> : null}
            </td>
          </tr>
        ) : null}
        <tr className={evenClsName}>
          <td rowSpan={MEMBER_CNT}>{member.name}</td>
          <td rowSpan={MEMBER_CNT}>
            <select
              className="select_box_dawn"
              onChange={({ target }) => handleCount(member._id, idx, 'dawn', target.value)}
              value={member.dawn}
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
              onChange={({ target }) => handleCount(member._id, idx, 'word', target.value)}
              value={member.word}
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </td>
          <td rowSpan={MEMBER_CNT}>
            <input className="checkbox" checked={member.cc} readOnly type="checkbox" onClick={() => handleCheck(member._id, idx, 'cc')} />
          </td>
          <td rowSpan={MEMBER_CNT}>
            <input className="checkbox" checked={member.mc} readOnly type="checkbox" onClick={() => handleCheck(member._id, idx, 'mc')} />
          </td>
          <td rowSpan={MEMBER_CNT}>
            <input className="checkbox" checked={member.yc} readOnly type="checkbox" onClick={() => handleCheck(member._id, idx, 'yc')} />
          </td>
        </tr>
        {MEMBER_CNT !== 1 ? member.members.map((v, i) => (
          <tr key={i}>
            <td rowSpan="1" key={i} className={evenClsName}>{v.name}</td>
            <td rowSpan="1" className={evenClsName}>
              <input className="checkbox" checked={v.cc} readOnly type="checkbox" onClick={() => handleCheckMember(member._id, v._id, v.sec, idx, 'cc')} />
            </td>
            <td rowSpan="1" className={evenClsName}>
              <input className="checkbox" checked={v.mc} readOnly type="checkbox" onClick={() => handleCheckMember(member._id, v._id, v.sec, idx, 'mc')} />
            </td>
            <td rowSpan="1" className={evenClsName}>
              <input className="checkbox" checked={v.yc} readOnly type="checkbox" onClick={() => handleCheckMember(member._id, v._id, v.sec, idx, 'yc')} />
            </td>
          </tr>
        )) : (
            null)}
      </Fragment>
    )
  })

  return reduced;
}

export const mapNetworkTable = ({ currentSection, handleCheck, handleCount, handleCheckMember, handleAddLeader, isAdmin }) => {
  if (!currentSection) return <div>아직 데이터가 없습니다😨</div>;
  return currentSection.map((network, idx) => {
    const networkName = network.length ? network[0].cellNameKr : '';
    return renderLeaderList({ network, idx, networkName, handleCheck, handleCount, handleCheckMember, handleAddLeader, isAdmin });
  });
}