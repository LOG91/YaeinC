import React from 'react';
import { useDispatch } from 'react-redux';
import { changeCurrentInfo } from '../../store/modules/checker';

const ConfirmModal = ({ cancelAction, message, confirmAction }) => {
  const dispatch = useDispatch();

  return (
    <div className="confirmModal-container">
      <div className="confirmModal-container__header">Confirm</div>
      <div className="confirmModal-container__message">{message}</div>
      <div className="button-box">
        <button className="btn btn-outline-dark button-box__button" onClick={confirmAction}>예</button>
        <button className="btn btn-outline-dark button-box__button" onClick={() => {
          dispatch(changeCurrentInfo('modalOpend', false));
          dispatch(changeCurrentInfo('currentModal', null));
        }}>취소</button>
      </div>
    </div>
  );
};


export default ConfirmModal;