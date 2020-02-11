import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Modal, ConfirmModal } from '../Modal';

import { connect } from 'react-redux';
import { changeCurrentInfo } from '../../store/modules/checker'

const NameInput = (props) => {
  const handleToggleModal = ({ inner }) => {
    const { changeCurrentInfo, modalOpend } = props;
    changeCurrentInfo('currentModal', !modalOpend ? inner : null);
    changeCurrentInfo('modalOpend', !modalOpend);
  }

  const { handleRemoveMember, value, handleChangeName, handleModifyName } = props;
  return (
    <>
      <input className="cell-table__input" name="name" onChange={handleChangeName} value={value} />
      <FontAwesomeIcon
        className="cell-table__td__button"
        icon={faCheckCircle}
        onClick={handleModifyName} />
      <FontAwesomeIcon
        className="cell-table__td__button"
        icon={faTimes}
        onClick={() => handleToggleModal({ inner: <Modal onToggleModal={handleToggleModal}><ConfirmModal confirmAction={handleRemoveMember} message={`멤버 ${value}를 삭제하시겠습니까?`} /></Modal> })}
      />
    </>
  )
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  changeCurrentInfo: (left, right) => dispatch(changeCurrentInfo(left, right))
});

export default connect(mapStateToProps, mapDispatchToProps)(NameInput);