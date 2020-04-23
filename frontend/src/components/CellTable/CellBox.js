import React, { useRef, useEffect } from 'react';

import { CheckBox } from '../CheckBox';
import { CountDropDown } from '../DropDown';
import NameInput from './NameInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import Sortable from 'sortablejs';

import { useDispatch, useSelector } from 'react-redux';

const CellBox = ({ len, isAdmin, network, index, handleCheck, handleCount, handleCheckMember, handleAddLeader, handleAddMember, handleModifyName, handleChangeName, handleRemoveMember, handleRemoveNetworkCell }) => {
  if (!network) return <div></div>;
  const dispatch = useDispatch();
  const currentSection = useSelector(state => state.checker.currentSection);
  const currentSheetId = useSelector(state => state.checker.currentSheetId);
  const ref = useRef(null);
  let sortableForLeader = null;

  useEffect(() => {
    if (sortableForLeader) sortableForLeader.destroy();
    const leaderListEl = document.querySelectorAll('.network-wrapper__flex--column');
    if (leaderListEl) {
      leaderListEl.forEach(item => {
        sortableForLeader = new Sortable(item,
          {
            sort: true,
            animation: 150,
            delay: 0,
            handle: ".member-container__button.fa-bars",
            onStart: () => {
              item.classList.add('sortabling');
            },
            onEnd: (evt) => {
              item.classList.remove('sortabling');
              const { target: { children } } = evt;
              const idList = [...children].map(node => node.dataset.id);
              fetch('/api/leader/seq', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  seq: JSON.stringify(idList)
                })
              }).then(res => res.json())
                .then(res => {
                  console.log(res);
                });
            }
          });
      });
    }
    return () => {
      // if (sortableForLeader) sortableForLeader.destroy();
    };
  }, [currentSection]);

  const reduced = network.leaders.map((leader, idxForKey) => {

    const MEMBER_CNT = leader.members.length + 1 + 1;
    return (
      <div className="network-container" key={idxForKey + leader} style={{ zIndex: ((len - index) * 10 - idxForKey) }} data-id={leader._id}>
        <ul className="network-container__list">
          <li className="network-container__item">
            <div className="network-container__position">
              {isAdmin ?
                (<NameInput
                  value={leader.name}
                  inputClassName="member-container__input"
                  buttonClassName="member-container__button"
                  handleRemoveMember={(e) => handleRemoveMember({ id: leader._id, sectionIdx: index, leaderIdx: idxForKey })}
                  handleChangeName={(e) => handleChangeName({ id: leader._id, sectionIdx: index, leaderIdx: idxForKey, changedName: e.target.value, nextNode: e.target.nextElementSibling })}
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
                    leaderIndex={index}
                    option={'dawn'}
                  />
                </li>
                <li className="leader-check__item">
                  <CountDropDown
                    handler={handleCount}
                    length={3}
                    leaderInfo={leader}
                    leaderIndex={index}
                    option={'word'}
                  />
                </li>
                <li className="leader-check__item">
                  <CheckBox checkedValue={leader.cc} onCheck={() => handleCheck(leader._id, index, 'cc')} />
                </li>
                <li className="leader-check__item">
                  <CheckBox checkedValue={leader.mc} onCheck={() => handleCheck(leader._id, index, 'mc')} />
                </li>
                <li className="leader-check__item">
                  <CheckBox checkedValue={leader.yc} onCheck={() => handleCheck(leader._id, index, 'yc')} />
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
                        handleRemoveMember={(e) => handleRemoveMember({ id: member._id, sectionIdx: index, leaderIdx: idxForKey, memberIdx: i })}
                        handleChangeName={(e) => handleChangeName({ id: member._id, sectionIdx: index, leaderIdx: idxForKey, changedName: e.target.value, nextNode: e.target.nextElementSibling, memberIdx: i })}
                      />) : member.name}
                  </div>
                </li>
              )) : (
                  null)}
              {isAdmin ?
                (<li className="member-container__item--add" style={leader.members.length > 1 ? { height: "20px" } : null}>
                  <div className="positioning--rel">
                    <div className="button-box" onClick={() => handleAddMember(leader)}><button className="btn btn-outline-dark button-box__button--add"><FontAwesomeIcon icon={faUserPlus} /></button></div>
                  </div>
                </li>) : null
              }
            </ul>
          </li>
          <li className="network-container__item">
            <ul className="member-container">
              {MEMBER_CNT !== 1 ? leader.members.map((member, i) => (
                <li className="member-container__item" key={member + i}>
                  <ul className="member-container__ul">
                    <li className="member-container__li">
                      <CheckBox buttonClassName="member-container__check" checkedValue={member.cc} onCheck={() => handleCheckMember(leader._id, member._id, i, index, 'cc')} />
                    </li>
                    <li className="member-container__li">
                      <CheckBox buttonClassName="member-container__check" checkedValue={member.mc} onCheck={() => handleCheckMember(leader._id, member._id, i, index, 'mc')} />
                    </li>
                    <li className="member-container__li">
                      <CheckBox buttonClassName="member-container__check" checkedValue={member.yc} onCheck={() => handleCheckMember(leader._id, member._id, i, index, 'yc')} />
                    </li>
                  </ul>
                </li>
              )) : (
                  null)}
            </ul>
          </li>
        </ul>
      </div>
    );
  });

  return <>
    <div className="network-wrapper" key={network.name} data-id={network._id}>
      <div className="network-wrapper__relative">
        <div className="network-wrapper__position">
          <div>{network.name}</div>
          {isAdmin && (
            <div>
              <FontAwesomeIcon
                className="network-wrapper__icon"
                icon={faTimes}
                onClick={() => handleRemoveNetworkCell({ id: network._id, cellName: network.name })}
              />
              <FontAwesomeIcon
                className="network-wrapper__icon"
                icon={faBars}
              />
            </div>
          )}
          {isAdmin && <div className="positioning--rel">
            <div className="button-box">
              <button
                className="btn btn-outline-dark button-box__button--add"
                onClick={() => handleAddLeader({ ...network, cellId: network._id })}
              >
                <FontAwesomeIcon icon={faUserPlus} />
              </button>
            </div>
          </div>}
        </div>
      </div>
      <div className="network-wrapper__flex--column">
        {reduced}
      </div>
    </div>
  </>;
};

export default CellBox;