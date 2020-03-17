import React, { useRef, useCallback } from 'react';
import { CheckBox } from '../CheckBox';
import { CountDropDown } from '../DropDown';
import NameInput from './NameInput';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faBars } from '@fortawesome/free-solid-svg-icons';

import { useDrag, useDrop } from 'react-dnd';
import { changeCurrentInfo } from '../../store/modules/checker';
import { useDispatch, useSelector } from 'react-redux';
import update from 'immutability-helper';


const CellList = (props) => {
  const dispatch = useDispatch();
  const currentSection = useSelector(state => state.checker.currentSection);
  const currentSheetId = useSelector(state => state.checker.currentSheetId);
  const { network, index, handleCheck, handleCount, handleCheckMember, handleAddLeader, handleAddMember, handleModifyName, handleChangeName, handleRemoveMember, isAdmin } = props.customProps;
  if (!network) return <div></div>;

  const ref = useRef(null);
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
      const moveCard = (dragIndex, hoverIndex) => {
        const dragCard = currentSection[dragIndex];
        console.log(dragCard, dragIndex, hoverIndex);
        dispatch(changeCurrentInfo('currentSection',
          update([...currentSection], {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, dragCard],
            ],
          }),
        ));
      };

      moveCard(dragIndex, hoverIndex);
      monitor.getItem().index = hoverIndex;
      // const idList = [...document.querySelector('.cell-wrapper').children].map(v => v.dataset.id);
      // fetch('/api/networkCell/seq', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ seq: JSON.stringify(idList), sheetId: currentSheetId })
      // }).then(res => res.json()).then(res => {
      //   console.log(res);
      // });
    },
    // drop: (e, monitor) => { console.log(e, monitor.getItem()); }
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: 'card', index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  const tmp = makeCellBox({ network: network.leaders, index, networkName: network.name, handleCheck, handleCount, handleCheckMember, handleAddLeader, handleAddMember, handleModifyName, handleChangeName, handleRemoveMember, isAdmin });
  return (
    <div className="network-wrapper" key={network.name + index} ref={ref}>
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
        {tmp}
      </div>
    </div>
  );
};

const makeCellBox = ({ isAdmin, network, index, handleCheck, handleCount, handleCheckMember, handleAddLeader, handleAddMember, handleModifyName, handleChangeName, handleRemoveMember }) => {
  const reduced = network.map((leader, idxForKey) => {
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

  return reduced;
};

export default CellList;