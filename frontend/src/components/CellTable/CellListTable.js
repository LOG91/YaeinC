import React, { Fragment } from 'react';
import { CheckBox } from '../CheckBox';
import { CountDropDown } from '../DropDown';

function renderCellList({ currentSection, handleCheck, handleCount, handleCheckMember, handleAddLeader, isAdmin }) {
  // if (!currentSection) return <div>아직 데이터가 없습니다😨</div>;
  const f = currentSection.map(v => v + 1);
  console.log(currentSection, f);
  const mappedByNetwork = currentSection.map((network, idx) => {
    if (!network) return;
    const networkName = network.length ? network[0].cellNameKr : '';
    const tmp = makeCellBox({ network, idx, networkName, handleCheck, handleCount, handleCheckMember, handleAddLeader, isAdmin });
    return tmp;
  });
  return mappedByNetwork;
};

const makeCellBox = ({ isAdmin, network, idx, networkName, handleCheck, handleCount, handleCheckMember, handleAddLeader, }) => {
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
          <tr className="network-box">
            <td className="network-box__td"
              rowSpan={all_members + 1}>
              <p className="network-box__p">{networkName}</p>
              {isAdmin ? <button className="btn btn-outline-dark network-box__button" onClick={e => handleAddLeader(leader, idx)}>추가</button> : null}
            </td>
          </tr>
        ) : null}
        <tr className={evenClsName}>
          <td className="cell-table__td" rowSpan={MEMBER_CNT}>{leader.name}</td>
          <td className="cell-table__td" rowSpan={MEMBER_CNT}>
            <CountDropDown
              handler={handleCount}
              length={6}
              leaderInfo={leader}
              leaderIndex={idx}
              option={'dawn'}
            />
          </td>
          <td className="cell-table__td" rowSpan={MEMBER_CNT}>
            <CountDropDown
              handler={handleCount}
              length={3}
              leaderInfo={leader}
              leaderIndex={idx}
              option={'word'}
            />
          </td>
          <td className="cell-table__td" rowSpan={MEMBER_CNT}>
            <CheckBox checkedValue={leader.cc} onCheck={() => handleCheck(leader._id, idx, 'cc')} />
          </td>
          <td className="cell-table__td" rowSpan={MEMBER_CNT}>
            <CheckBox checkedValue={leader.mc} onCheck={() => handleCheck(leader._id, idx, 'mc')} />
          </td>
          <td className="cell-table__td" rowSpan={MEMBER_CNT}>
            <CheckBox checkedValue={leader.yc} onCheck={() => handleCheck(leader._id, idx, 'yc')} />
          </td>
        </tr>
        {MEMBER_CNT !== 1 ? leader.members.map((member, i) => (
          <tr key={i}>
            <td className="cell-table__td" rowSpan="1" key={i}>{member.name}</td>
            <td className="cell-table__td" rowSpan="1">
              <CheckBox checkedValue={member.cc} onCheck={() => handleCheckMember(leader._id, member._id, i, idx, 'cc')} />
            </td>
            <td className="cell-table__td" rowSpan="1">
              <CheckBox checkedValue={member.mc} onCheck={() => handleCheckMember(leader._id, member._id, i, idx, 'mc')} />
            </td>
            <td className="cell-table__td" rowSpan="1">
              <CheckBox checkedValue={member.yc} onCheck={() => handleCheckMember(leader._id, member._id, i, idx, 'yc')} />
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