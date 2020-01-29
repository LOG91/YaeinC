import React, { PureComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

class NameInput extends PureComponent {
  
  render() {
    const { value, handleChangeName, handleModifyName } = this.props;
    return (
      <>
        <input className="cell-table__input" name="name" onChange={handleChangeName} value={value} />
        <FontAwesomeIcon className="cell-table__td__button" icon={faCheckCircle} onClick={handleModifyName} />
      </>
    )
  }
}
export default NameInput;