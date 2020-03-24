import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CheckBox } from '../CheckBox';
import { CountDropDown } from '../DropDown';
import NameInput from './NameInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faBars } from '@fortawesome/free-solid-svg-icons';

import { useDrag, useDrop } from 'react-dnd';
import { changeCurrentInfo, dndChange } from '../../store/modules/checker';
import { useDispatch, useSelector } from 'react-redux';
import update from 'immutability-helper';

const CellBox = ({ moveCard, isAdmin, network, index, handleCheck, handleCount, handleCheckMember, handleAddLeader, handleAddMember, handleModifyName, handleChangeName, handleRemoveMember }) => {
  if (!network) return <div></div>;
  const dispatch = useDispatch();
  const currentSection = useSelector(state => state.checker.currentSection);
  const currentSheetId = useSelector(state => state.checker.currentSheetId);
  const ref = useRef(null);
  console.log('이게 리랜더링 되야함', network);

  const [, drop] = useDrop({
    accept: 'card',
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      console.log(dragIndex, hoverIndex);


      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    // drop: (e, monitor) => { console.log(e, monitor.getItem()); }
  });

  const [spec, drag] = useDrag({
    item: { type: 'card', index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    end: (result, monitor) => {
      dispatch(changeCurrentInfo('currentSection', [...currentSection]));
      fetch('/api/networkCell/seq', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          seq: JSON.stringify([...currentSection].map(v => v._id)),
          sheetId: currentSheetId
        })
      }).then(res => res.json()).then(res => console.log(res));
      // console.log(monitor);
    },
    begin: (monitor) => {
      console.log(monitor);
    },
    canDrag: (monitor, f) => {
      console.log(monitor);
      return true;
    }
  });
  drag(drop(ref));

  const reduced = network.leaders.map((leader, idxForKey) => {
    const MEMBER_CNT = leader.members.length + 1 + 1;
    return (
      <div className="network-container" key={idxForKey + leader} data-id={leader._id}>
        <ul className="network-container__list">
          <li className="network-container__item">
            <div className="network-container__position">
              {isAdmin ?
                (<NameInput
                  value={leader.name}
                  inputClassName="member-container__input"
                  buttonClassName="member-container__button"
                  handleRemoveMember={(e) => handleRemoveMember({ id: leader._id, sectionIdx: index, leaderIdx: idxForKey })}
                  handleChangeName={(e) => handleChangeName({ sectionIdx: index, leaderIdx: idxForKey, changedName: e.target.value, nextNode: e.target.nextElementSibling })}
                  handleModifyName={(e) => handleModifyName({ id: leader._id, sectionIdx: index, leaderIdx: idxForKey, target: e.target.closest('svg') })}
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
                        handleChangeName={(e) => handleChangeName({ sectionIdx: index, leaderIdx: idxForKey, changedName: e.target.value, nextNode: e.target.nextElementSibling, memberIdx: i })}
                        handleModifyName={(e) => handleModifyName({ id: member._id, sectionIdx: index, leaderIdx: idxForKey, target: e.target.parentNode, memberIdx: i })}
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
    <div className="network-wrapper" key={network.name} ref={ref}>
      <div className="network-wrapper__relative">
        <div className="network-wrapper__position">
          <div>{network.name}</div>
          <FontAwesomeIcon
            className="network-wrapper__icon"
            icon={faBars}
          />
        </div>
      </div>
      <div className="network-wrapper__flex--column">
        {reduced}
      </div>
    </div>
  </>;
};

export default CellBox;