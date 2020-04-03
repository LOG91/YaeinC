import React, { useCallback, useState } from 'react';
import { changeCurrentInfo } from '../../store/modules/checker';
import { useDispatch, useSelector } from 'react-redux';
import CellBox from './CellBox';
import update from 'immutability-helper';


const CellList = (props) => {
  const currentSection = useSelector(state => state.checker.currentSection);

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

  return (currentSection ? currentSection.map((network, index) => {
    console.log(network);
    return (
      <CellBox
        key={network + index}
        isAdmin={isAdmin}
        len={currentSection.length}
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

    );
  }) : null
  );
};



export default CellList;