import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimes, faBars } from '@fortawesome/free-solid-svg-icons';
import { Modal, ConfirmModal } from '../Modal';

import { connect } from 'react-redux';
import { changeCurrentInfo } from '../../store/modules/checker'

const NameInput = (props) => {
  const handleToggleModal = ({ inner }) => {
    const { changeCurrentInfo, modalOpend } = props;
    changeCurrentInfo('currentModal', !modalOpend ? inner : null);
    changeCurrentInfo('modalOpend', !modalOpend);
  };

  const { handleRemoveMember, value, handleChangeName, buttonClassName, inputClassName } = props;
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

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  changeCurrentInfo: (left, right) => dispatch(changeCurrentInfo(left, right))
});

export default connect(mapStateToProps, mapDispatchToProps)(NameInput);