import React, { Component } from 'react';
import Sortable from 'sortablejs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { changeCurrentInfo, removeSheet, sequenceSheet } from '../../store/modules/checker';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Tab.scss';

import { Modal, ConfirmModal } from '../Modal';

class Tab extends Component {
  constructor(props) {
    super(props);
    this.tabRef = React.createRef();
    this.currentSortable = null;
  }

  componentDidUpdate(prevState, next) {
    const { sheets } = this.props;
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
          const { oldIndex, newIndex } = evt;
          console.log(sheets);
          const prev = sheets[oldIndex];
          const now = sheets[newIndex];
          fetch('/api/sheet/seq', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              _id: prev._id,
              seq: now.seq
            })
          }).then(res => res.json())
            .then(res => {
              sequenceSheet(oldIndex, res.seq);
              fetch('/api/sheet/seq', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  _id: now._id,
                  seq: prev.seq
                })
              }).then(res => res.json())
                .then(res => sequenceSheet(newIndex, res.seq));
            });
        }
      })
    return true;
  };

  handleClick = async (sheetName) => {
    const { changeCurrentInfo, sheets } = this.props;
    const currentSheetId = sheets.length && sheets.find(v => v.name === sheetName)._id;
    changeCurrentInfo('currentSheetId', currentSheetId);
    const networkCells = await fetch(`/api/networkCell/${currentSheetId}`).then(res => res.json()).then();
    const mapped = networkCells.map(v => v.name);
    changeCurrentInfo('networkCells', networkCells);
    fetch(`/api/cells/${JSON.stringify(mapped)}`)
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

  handleMoveSheet = () => {

  }

  handleToggleModal = ({ inner }) => {
    const { modalOpend, changeCurrentInfo } = this.props;
    changeCurrentInfo('currentModal', !modalOpend ? inner : null);
    changeCurrentInfo('modalOpend', !modalOpend);
  }

  render() {
    const { isAdmin, attached, sheets, currentSheet } = this.props;
    return (
      <ul className="tab" ref={this.tabRef}>
        {sheets.map((v, idx) => {
          return <li key={idx} className={currentSheet === v.name ? "index active" : "index"}>
            <Link className={isAdmin ? "index__a--admin" : "index__a"} to={`/${isAdmin ? 'admin/' : ''}${attached}/${v.name}`} onClick={() => this.handleClick(v.name)} >{v.name}</Link>
            {isAdmin ? <div className="icon-wrapper icon-wrapper--center">
              <div className="icon-wrapper__icon--move"><FontAwesomeIcon icon={faBars} /></div>
              <div className="icon-wrapper__icon--delete" onClick={() => this.handleDeleteSheet({ id: v._id, idx })}><FontAwesomeIcon icon={faTrashAlt} /></div>
            </div> : null}
          </li>
        })}
      </ul>
    )
  }
}

const mapStateToProps = (state) => ({
  currentSection: state.checker.currentSection,
  attached: state.checker.attached,
  sheets: state.checker.sheets,
  networkCells: state.checker.networkCells,
  modalOpend: state.checker.modalOpend
});

const mapDispatchToProps = dispatch => ({
  increment: () => dispatch(increment()),
  changeCurrentInfo: (left, right) => dispatch(changeCurrentInfo(left, right)),
  removeSheet: (idx) => dispatch(removeSheet(idx)),
  sequenceSheet: (idx, seq) => dispatch(sequenceSheet(idx, seq))
});

export default connect(mapStateToProps, mapDispatchToProps)(Tab);