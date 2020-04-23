import React from 'react';
import { useSelector } from 'react-redux';
import CellBox from './CellBox';


const CellList = (props) => {
  const currentSection = useSelector(state => state.checker.currentSection);

  const { handleModifyName,
    handleCheck,
    handleCount,
    handleCheckMember,
    handleAddLeader,
    handleAddMember,
    handleChangeName,
    handleRemoveMember,
    handleRemoveNetworkCell,
    isAdmin }
    = props.customProps;

  return (currentSection ? currentSection.map((network, index) => {
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
        handleRemoveNetworkCell={handleRemoveNetworkCell}
      />

    );
  }) : null
  );
};



export default CellList;