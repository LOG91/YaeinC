import React, { Fragment } from 'react';

const renderLeaderList = (list, idx, networkName, handleCheck) => {
  console.log(list, 'list data');
  const all_members = list.reduce((ac, cv) => {
    console.log(cv.members);
    ac += cv.members.length;
    return ac;
  },0) + list.length;
  
  const evenClsName = (idx % 2 === 0) ? 'i2' : '';
  console.log(evenClsName);
  const reduced = list.map((member, idxForKey) => {
    const MEMBER_CNT = member.members.length + 1;
    return (
      <Fragment key={idxForKey}>
      {idxForKey === 0 ? <td rowSpan={all_members + 1} className={evenClsName}>{networkName}</td> : null}
      <tr className={evenClsName}>
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
          <label onClick={() => handleCheck(member.name, 'cc', idx)} />
        </td>
        <td rowSpan={MEMBER_CNT}>
          <input className="styled-checkbox" checked={member.mc} readOnly type="checkbox" />
          <label onClick={() => handleCheck(member.name, 'mc', idx)} />
        </td>
        <td rowSpan={MEMBER_CNT}>
          <input className="styled-checkbox" checked={member.yc} readOnly type="checkbox" />
          <label onClick={() => handleCheck(member.name, 'yc', idx)} />
        </td>
      </tr>
      {MEMBER_CNT !== 1 ? member.members.map((v, i) =>(
        <tr key={i}>
          <td rowSpan="1" key={i} className={evenClsName}>{v.name}</td>
          <td rowSpan="1" className={evenClsName}>
            <input className="styled-checkbox" checked={v.cc} readOnly type="checkbox" />
            <label />
          </td>
          <td rowSpan="1" className={evenClsName}>
            <input className="styled-checkbox" checked={v.mc} readOnly type="checkbox" />
            <label />
          </td>
          <td rowSpan="1" className={evenClsName}>
            <input className="styled-checkbox" checked={v.yc} readOnly type="checkbox" />
            <label />
          </td>
        </tr>
      )): (
      null)}
      </Fragment>
    )
  })

  return reduced;
}

const re = async (section) => {
  const f = await fetch(`/api/section/${section}`);
  const res = await f.json();
  console.log(res);
  return res;
}

export const mapNetworkTable = (list, handleCheck) => {
  if (!list) return <div>아직 데이터가 없습니다😨</div>;
    
    // return renderLeaderList(list);
    return list.map((network, idx) => {
      const networkName = network.length ? network[0].cellNameKr : '';
      return renderLeaderList(network, idx, networkName, handleCheck);
    });
}