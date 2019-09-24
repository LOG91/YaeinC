import React from 'react';
import './Modal.scss';

const Modal = ({ children }) => {
  return (
    <div className="Modal">
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default Modal;