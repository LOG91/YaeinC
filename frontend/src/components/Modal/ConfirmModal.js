import React from 'react';


const ConfirmModal = ({ cancelAction, message, confirmAction }) => {

  return (
    <div className="confirmModal-container">
      <div className="confirmModal-container__header">Confirm</div>
      <div className="confirmModal-container__message">{message}</div>
      <div className="button-box">
        <button className="btn btn-outline-dark button-box__button" onClick={confirmAction}>예</button>
        <button className="btn btn-outline-dark button-box__button" onClick={cancelAction}>취소</button>
      </div>
    </div>
  );
}

export default ConfirmModal;