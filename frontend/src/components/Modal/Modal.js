import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Modal.scss';
import { changeCurrentInfo } from '../../store/modules/checker';

const Modal = (props) => {
  const modalOpened = useSelector(state => state.checker.modalOpened);
  const dispatch = useDispatch();
  const onToggleModal = () => {
    dispatch(changeCurrentInfo('modalOpend', false));
    dispatch(changeCurrentInfo('currentModal', null));
  }
  useEffect(() => {
    window.onkeyup = e => {
      if (e.keyCode === 27) onToggleModal({ offOption: true });
    }
    return () => {
      window.onkeyup = e => {
        if (e.keyCode === 27) null;
      }
    }
  }, [])
  const { children } = props;
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


class Modal2 extends React.Component {
  constructor(props) {
    super(props);
  }
  interval;
  componentDidMount() {
    const { onToggleModal } = this.props;
    window.onkeyup = e => {
      if (e.keyCode === 27) onToggleModal({ offOption: true });
    }
    this.interval = setInterval(() => console.log(123), 1000);
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