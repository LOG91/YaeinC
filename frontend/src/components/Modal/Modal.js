import React from 'react';
import './Modal.scss';

class Modal extends React.Component {
  constructor(props) {
    super(props);
  }
  interval;
  componentDidMount() {
    const { onToggleModal } = this.props;
    window.onkeyup = e => {
      if (e.keyCode === 27) onToggleModal({ offOption: true });
    }
    this.interval = setInterval(()=> console.log(123), 1000);
  }
  componentWillUnmount() {
    window.onkeyup = e => {
      if (e.keyCode === 27) null;
    }
    clearInterval(this.interval);
  }

  render() {
    const { children, onToggleModal, modalOpened } = this.props;
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { onToggleModal, modalOpened })
    );

    return (
      <div className="modal__wrap">
        <div className="content">
          {childrenWithProps}
        </div>
      </div>)
  };

}
export default Modal;