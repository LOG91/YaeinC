import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBars } from '@fortawesome/free-solid-svg-icons';
import { Modal, ConfirmModal } from '../Modal';

import { useDispatch } from 'react-redux';
import { changeCurrentInfo } from '../../store/modules/checker'

const NameInput = (props) => {
  const { modalOpend, handleRemoveMember, value, handleChangeName, buttonClassName, inputClassName } = props;
  const dispatch = useDispatch();

  const handleToggleModal = ({ inner }) => {
    dispatch(changeCurrentInfo('currentModal', !modalOpend ? inner : null));
    dispatch(changeCurrentInfo('modalOpend', !modalOpend));
  };

  return (
    <>
      <input className={inputClassName} name="name" onChange={handleChangeName} value={value} />
      <FontAwesomeIcon
        className={buttonClassName}
        icon={faTimes}
        onClick={() => handleToggleModal({ inner: <Modal onToggleModal={handleToggleModal}><ConfirmModal confirmAction={handleRemoveMember} message={`멤버 ${value}를 삭제하시겠습니까?`} /></Modal> })}
      />
      <FontAwesomeIcon
        className={buttonClassName}
        icon={faBars}
      />
    </>
  );
};


export default NameInput;