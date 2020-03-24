import React, { useCallback, useState } from 'react';
import { changeCurrentInfo } from '../../store/modules/checker';
import { useDispatch, useSelector } from 'react-redux';
import CellBox from './CellBox';
import update from 'immutability-helper';


const CellList = (props) => {
  const currentSection = useSelector(state => state.checker.currentSection);
  const cf = [...currentSection];
  const [cs, setCs] = useState(cf);
  const { handleCheck, handleCount, handleCheckMember, handleAddLeader, handleAddMember, handleChangeName, handleRemoveMember, isAdmin } = props.customProps;

  const handleModifyName = ({ id, sectionIdx, leaderIdx, target, memberIdx }) => {
    const changedName = typeof memberIdx !== 'undefined' ?
      currentSection[sectionIdx].leaders[leaderIdx].members[memberIdx].name :
      currentSection[sectionIdx].leaders[leaderIdx].name;
    fetch(`/api/change/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ changedName })
    });
    target.classList.remove('active');
  };
  const dispatch = useDispatch();

  const moveCard = (dragIndex, hoverIndex) => {
    const dragCard = currentSection[dragIndex];
    console.log(dragCard, dragIndex, hoverIndex);
    // setCs(update(cs, {
    //   $splice: [
    //     [dragIndex, 1],
    //     [hoverIndex, 0, cs[dragIndex]],
    //   ],
    // }));
    const newCurrentSection = update(currentSection, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, currentSection[dragIndex]],
      ],
    });
    dispatch(
      changeCurrentInfo('currentSection', newCurrentSection));

    // dispatch(dndChange(dragIndex, hoverIndex));
  };
  
  console.log(123);
  return (
    currentSection.map((network, index) => {
      return (
        <CellBox
          key={network + index}
          moveCard={moveCard}
          isAdmin={isAdmin}
          network={network}
          index={index}
          handleCheck={handleCheck}
          handleCount={handleCount}
          handleCheckMember={handleCheckMember}
          handleAddLeader={handleAddLeader}
          handleAddMember={handleAddMember}
          handleModifyName={handleModifyName}
          handleChangeName={handleChangeName}
          handleRemoveMember={handleRemoveMember}
        />

      )
    })
  );
};



export default CellList;