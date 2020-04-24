import React, { Component } from 'react';
import Sortable from 'sortablejs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faEdit, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { changeCurrentInfo, removeSheet, sequenceSheet } from '../../store/modules/checker';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import './Tab.scss';

import { Modal, ConfirmModal } from '../Modal';

class Tab extends Component {
  constructor(props) {
    super(props);
    this.tabRef = React.createRef();
    this.currentSortable = null;
    this.state = {
      isEdit: false,
      editIdx: null,
      insertedSheetName: ''
    }
  }

  componentDidUpdate(prevState, next) {
    const el = document.querySelector('.tab');
    if (this.currentSortable !== null) this.currentSortable.destroy();
    this.currentSortable = new Sortable(el,
      {
        sort: true,
        delay: 0,
        animation: 150,
        handle: '.icon-wrapper__icon--move',
        onStart: (/**Event*/evt) => {
          this.tabRef.current.classList.add("sortabling");
        },
        onEnd: (evt) => {
          this.tabRef.current.classList.remove("sortabling");
          const { target: { children } } = evt;
          const idList = [...children].map(node => node.dataset.id);
          fetch('/api/sheet/seq', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              attached: this.props.attached,
              seq: JSON.stringify(idList)
            })
          }).then(res => res.json())
            .then(res => {
              console.log(res);
            });
        }
      })
    return true;
  };
  componentWillUnmount() {
    const { changeCurrentInfo } = this.props;
    changeCurrentInfo('sheets', []);
    changeCurrentInfo('networkCells', []);
  }

  handleClick = async (sheetId) => {
    const { changeCurrentInfo, sheets } = this.props;
    const currentSheetInfo = sheets.length && sheets.find(v => v._id === sheetId);
    changeCurrentInfo('currentSheetInfo', currentSheetInfo);
    const networkCells = await fetch(`/api/networkCell/${currentSheetInfo._id}`).then(res => res.json()).then();
    changeCurrentInfo('networkCells', networkCells);
    fetch(`/api/cells?cells=${JSON.stringify(networkCells)}`)
      .then(res => res.json())
      .then(cells => {
        changeCurrentInfo('currentSection', cells);
      });
  }

  handleDeleteSheet = ({ id, idx }) => {
    const { removeSheet } = this.props;
    this.handleToggleModal({
      inner: <Modal>
        <ConfirmModal
          message="시트를 삭제하시겠습니까?"
          confirmAction={() => {
            fetch(`/api/sheet/${id}`, {
              method: 'DELETE'
            }).then(res => res.json())
              .then(res => {
                if (res.ok) {
                  this.handleToggleModal({});
                  removeSheet(idx);
                }

              })
          }} />
      </Modal>
    })
  }

  handleEditButton = ({ id, name, idx }) => {
    this.setState({ isEdit: true, editIdx: idx, insertedSheetName: name });
  }
  handleEditSheetName = ({ id, name, idx }) => {
    const { history, attached } = this.props;
    fetch('/api/sheet/edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, name })
    }).then(res => res.json()).then(res => {
      if (res) {
        this.setState({ isEdit: false, editIdx: null, insertedSheetName: '' });
        history.push(`/admin/${attached}/${res.name}`);
      }
    });
  }

  handleToggleModal = ({ inner }) => {
    const { modalOpend, changeCurrentInfo } = this.props;
    changeCurrentInfo('currentModal', !modalOpend ? inner : null);
    changeCurrentInfo('modalOpend', !modalOpend);
  }

  render() {
    const { isAdmin, attached, sheets, currentSheetInfo } = this.props;
    const { isEdit, editIdx, insertedSheetName } = this.state;
    const sheetId = currentSheetInfo && currentSheetInfo._id;
    return (
      <ul className="tab" ref={this.tabRef}>
        {sheets.map((v, idx) => {
          return <li key={idx} className={sheetId === v._id ? "index active" : "index"} data-id={v._id}>
            {!isEdit || editIdx !== idx ?
              (<Link className={isAdmin ? "index__a--admin" : "index__a"} to={`/${isAdmin ? 'admin/' : ''}${attached}/${v.name}`} onClick={() => this.handleClick(v._id)} >{v.name}</Link>)
              : (<><input className="index__input" type="text" value={insertedSheetName} onChange={(e) => this.setState({ insertedSheetName: e.target.value })} />
                <FontAwesomeIcon className="index__button--edit" icon={faCheckCircle} onClick={() => this.handleEditSheetName({ id: v._id, name: this.state.insertedSheetName })} /></>)
            }
            {isAdmin ? <div className="icon-wrapper icon-wrapper--center">
              <div className={`icon-wrapper__icon--edit ${sheetId === v._id && "active"}`} onClick={() => this.handleEditButton({ id: v._id, name: v.name, idx })}><FontAwesomeIcon icon={faEdit} /></div>
              <div className={`icon-wrapper__icon--move ${sheetId === v._id && "active"}`}><FontAwesomeIcon icon={faBars} /></div>
              <div className={`icon-wrapper__icon--delete ${sheetId === v._id && "active"}`} onClick={() => this.handleDeleteSheet({ id: v._id, idx })}><FontAwesomeIcon icon={faTrashAlt} /></div>
            </div> : null}
          </li>
        })}
      </ul>
    )
  }
}

const mapStateToProps = (state) => ({
  attached: state.checker.attached,
  sheets: state.checker.sheets,
  networkCells: state.checker.networkCells,
  modalOpend: state.checker.modalOpend,
  currentSheetInfo: state.checker.currentSheetInfo
});

const mapDispatchToProps = dispatch => ({
  increment: () => dispatch(increment()),
  changeCurrentInfo: (left, right) => dispatch(changeCurrentInfo(left, right)),
  removeSheet: (idx) => dispatch(removeSheet(idx)),
  sequenceSheet: (idx, seq) => dispatch(sequenceSheet(idx, seq))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Tab));