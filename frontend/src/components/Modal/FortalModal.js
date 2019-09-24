import ReactDOM from 'react-dom';

const FortalModal = ({ children }) => {
  const el = document.getElementById('modal');
  return ReactDOM.createPortal(children, el);
}

export default FortalModal;