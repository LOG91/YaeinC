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
            <input type="checkbox" className="custom-checkbox" checked={member.cc} readOnly />
            <label className="check" onClick={() => handleCheck(member._id, idx, 'cc')}>
              <svg width="18px" height="18px" viewBox="0 0 18 18">
                <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                <polyline points="1 9 7 14 15 4"></polyline>
              </svg>
            </label>
          </td>
          <td rowSpan={MEMBER_CNT}>
            <input type="checkbox" className="custom-checkbox" checked={member.mc} readOnly />
            <label className="check" onClick={() => handleCheck(member._id, idx, 'mc')}>
              <svg width="18px" height="18px" viewBox="0 0 18 18">
                <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                <polyline points="1 9 7 14 15 4"></polyline>
              </svg>
            </label>
          </td>
          <td rowSpan={MEMBER_CNT}>
            <input type="checkbox" className="custom-checkbox" checked={member.yc} readOnly />
            <label className="check" onClick={() => handleCheck(member._id, idx, 'yc')}>
              <svg width="18px" height="18px" viewBox="0 0 18 18">
                <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                <polyline points="1 9 7 14 15 4"></polyline>
              </svg>
            </label>
          </td>
        </tr>
        {MEMBER_CNT !== 1 ? member.members.map((v, i) => (
          <tr key={i}>
            <td rowSpan="1" key={i} className={evenClsName}>{v.name}</td>
            <td rowSpan="1" className={evenClsName}>
              <input type="checkbox" className="custom-checkbox" checked={v.cc} readOnly />
              <label className="check" onClick={() => handleCheckMember(member._id, v._id, v.sec, idx, 'cc')}>
                <svg width="18px" height="18px" viewBox="0 0 18 18">
                  <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                  <polyline points="1 9 7 14 15 4"></polyline>
                </svg>
              </label>
            </td>
            <td rowSpan="1" className={evenClsName}>
              <input type="checkbox" className="custom-checkbox" checked={v.mc} readOnly />
              <label className="check" onClick={() => handleCheckMember(member._id, v._id, v.sec, idx, 'mc')}>
                <svg width="18px" height="18px" viewBox="0 0 18 18">
                  <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                  <polyline points="1 9 7 14 15 4"></polyline>
                </svg>
              </label>
            </td>
            <td rowSpan="1" className={evenClsName}>
              <input type="checkbox" className="custom-checkbox" checked={v.yc} readOnly />
              <label className="check" onClick={() => handleCheckMember(member._id, v._id, v.sec, idx, 'yc')}>
                <svg width="18px" height="18px" viewBox="0 0 18 18">
                  <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                  <polyline points="1 9 7 14 15 4"></polyline>
                </svg>
              </label>
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