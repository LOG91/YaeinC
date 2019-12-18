import React from 'react';


const ConfirmModal = ({ confirmAction, onToggleModal }) => {

  return (
    <div className="confirmModal-container">
      <div>Confirm</div>
      <div className="confirmModal-container__message">초기화 하시겠습니까?</div>
      <div className="confirmModal-container__button-box">
        <button className="btn btn-info" onClick={confirmAction}>예</button>
        <button className="btn btn-danger" onClick={onToggleModal}>취소</button>
      </div>
    </div>
  );
}

export default ConfirmModal;