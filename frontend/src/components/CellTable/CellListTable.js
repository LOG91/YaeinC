import React, { Fragment } from 'react';
import { CheckBox } from '../CheckBox';
import { CountDropDown } from '../DropDown';
import NameInput from './NameInput';
import { Modal } from '../Modal';
import AddForm from '../AddForm/AddForm';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'

function renderCellList({ currentSection, handleCheck, handleCount, handleCheckMember, handleAddLeader, handleModifyName, handleChangeName, handleRemoveMember, isAdmin, handleAddMember }) {
  if (!currentSection) return <div></div>;
  const mappedByNetwork = currentSection.map((network, idx) => {
    if (!network) return;
    const networkName = network.length ? network[0].cellNameKr : '';
    const tmp = makeCellBox({ network, idx, networkName, handleCheck, handleCount, handleCheckMember, handleAddLeader, handleModifyName, handleChangeName, handleRemoveMember, isAdmin, handleAddMember });
    return tmp;
  });
  return mappedByNetwork;
};

const makeCellBox = ({ isAdmin, network, idx, networkName, handleCheck, handleCount, handleCheckMember, handleAddLeader, handleModifyName, handleChangeName, handleRemoveMember, handleAddMember }) => {
  const all_members = network.reduce((ac, cv) => {
    ac += cv.members.length + 1;
    return ac;
  }, 0) + network.length;

  const reduced = network.map((leader, idxForKey) => {
    const MEMBER_CNT = leader.members.length + 1 + 1;
    return (
      <div className="network-container" key={idxForKey + leader}>
        <ul className="network-container__list">
          {idxForKey === 0 ? (
            <li className="network-container__item">
              <div className="network-box"
                rowSpan={all_members + 1}>
                <div className="network-box__name">{networkName}</div>
                {isAdmin ?
                  <button
                    className="btn btn-outline-dark network-box__button"
                    onClick={e => handleAddLeader({ inner: <Modal onToggleModal={handleAddLeader}><AddForm cellInfo={leader} cellIndex={idx} /></Modal>, leader, idx })}>
                    추가
                </button> :
                  null}
              </div>
            </li>
          ) : null}
          <li className="network-container__item" rowSpan={MEMBER_CNT}>
            <div className="network-container__position">
              {isAdmin ?
                (<NameInput
                  value={leader.name}
                  inputClassName="member-container__input"
                  buttonClassName="member-container__button"
                  handleRemoveMember={(e) => handleRemoveMember({ id: leader._id, sectionIdx: idx, leaderIdx: idxForKey })}
                  handleChangeName={(e) => handleChangeName({ sectionIdx: idx, leaderIdx: idxForKey, changedName: e.target.value, nextNode: e.target.nextElementSibling })}
                  handleModifyName={(e) => handleModifyName({ id: leader._id, sectionIdx: idx, leaderIdx: idxForKey, target: e.target.closest('svg') })}
                />) : leader.name}
            </div>
          </li>
          <li className="network-container__item">
            <div className="network-container__position">
              <ul className="leader-check__list">
                <li className="leader-check__item">
                  <CountDropDown
                    handler={handleCount}
                    length={6}
                    leaderInfo={leader}
                    leaderIndex={idx}
                    option={'dawn'}
                  />
                </li>
                <li className="leader-check__item">
                  <CountDropDown
                    handler={handleCount}
                    length={3}
                    leaderInfo={leader}
                    leaderIndex={idx}
                    option={'word'}
                  />
                </li>
                <li className="leader-check__item">
                  <CheckBox checkedValue={leader.cc} onCheck={() => handleCheck(leader._id, idx, 'cc')} />
                </li>
                <li className="leader-check__item">
                  <CheckBox checkedValue={leader.mc} onCheck={() => handleCheck(leader._id, idx, 'mc')} />
                </li>
                <li className="leader-check__item">
                  <CheckBox checkedValue={leader.yc} onCheck={() => handleCheck(leader._id, idx, 'yc')} />
                </li>
              </ul>
            </div>
          </li>
          <li className="network-container__item">
            <ul className="member-container">
              {MEMBER_CNT !== 1 ? leader.members.map((member, i) => (
                <li className="member-container__item" key={member + i}>
                  <div className="member-container__position">
                    {isAdmin ?
                      (<NameInput
                        value={member.name}
                        inputClassName="member-container__input"
                        buttonClassName="member-container__button"
                        handleRemoveMember={(e) => handleRemoveMember({ id: member._id, sectionIdx: idx, leaderIdx: idxForKey, memberIdx: i })}
                        handleChangeName={(e) => handleChangeName({ sectionIdx: idx, leaderIdx: idxForKey, changedName: e.target.value, nextNode: e.target.nextElementSibling, memberIdx: i })}
                        handleModifyName={(e) => handleModifyName({ id: member._id, sectionIdx: idx, leaderIdx: idxForKey, target: e.target.parentNode, memberIdx: i })}
                      />) : member.name}
                  </div>
                </li>
              )) : (
                  null)}
            </ul>
          </li>
          <li className="network-container__item">
            <ul className="member-container">
              {MEMBER_CNT !== 1 ? leader.members.map((member, i) => (
                <li className="member-container__item" key={member + i}>
                  <ul className="member-container__ul">
                    <li className="member-container__li">
                      <CheckBox buttonClassName="member-container__check" checkedValue={member.cc} onCheck={() => handleCheckMember(leader._id, member._id, i, idx, 'cc')} />
                    </li>
                    <li className="member-container__li">
                      <CheckBox buttonClassName="member-container__check" checkedValue={member.mc} onCheck={() => handleCheckMember(leader._id, member._id, i, idx, 'mc')} />
                    </li>
                    <li className="member-container__li">
                      <CheckBox buttonClassName="member-container__check" checkedValue={member.yc} onCheck={() => handleCheckMember(leader._id, member._id, i, idx, 'yc')} />
                    </li>
                  </ul>
                </li>
              )) : (
                  null)}
            </ul>
          </li>
          {/* <div className="button-box" onClick={() => handleAddMember(leader)}><button className="btn btn-outline-dark button-box__button--add"><FontAwesomeIcon icon={faUserPlus} />버추가</button></div> */}
        </ul>
      </div>
    );
  });

  return reduced;
};

export default renderCellList;