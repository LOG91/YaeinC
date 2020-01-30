import React, { PureComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FortalModal, Modal, ConfirmModal } from '../Modal';

import { connect } from 'react-redux';
import { changeCurrentInfo, modalOpend, currentModal } from '../../store/modules/checker'

class NameInput extends PureComponent {
  
  handleToggleModal = ({ inner }) => {
    const { changeCurrentInfo, modalOpend } = this.props;
    changeCurrentInfo('currentModal', !modalOpend ? inner : null);
    changeCurrentInfo('modalOpend', !modalOpend);
  }

  render() {
    const { handleRemoveMember, value, handleChangeName, handleModifyName, currentModal, modalOpend } = this.props;
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
          onClick={() => this.handleToggleModal({ inner: <Modal onToggleModal={this.handleToggleModal}><ConfirmModal confirmAction={handleRemoveMember} message={`멤버 ${value}를 삭제하시겠습니까?`} /></Modal> })}
        />
      </>
    )
  }
}

const mapStateToProps = state => ({
  currentModal: state.checker.currentModal,
  modalOpend: state.checker.modalOpend
});

const mapDispatchToProps = dispatch => ({
  changeCurrentInfo: (left, right) => dispatch(changeCurrentInfo(left, right))
});

export default connect(mapStateToProps, mapDispatchToProps)(NameInput);