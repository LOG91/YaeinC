/*eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sortable from 'sortablejs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, bar } from '@fortawesome/free-regular-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import './ChurchList.scss';

import { changeCurrentInfo, sequenceChurch, removeChurch } from '../../store/modules/checker';
import { insertMemberData, initMemberData } from '../../store/modules/inserted';

import { Modal, ConfirmModal } from '../Modal'
import ChurchForm from '../AddForm/ChurchForm';

const spreadChurchList = ({ churches, isAdmin, handleToggleModal, handleChange, addChurch, handleDeleteChurch }) => {

  return (
    <>
      {churches.map(({ name, attached, _id }, idx) => {
        return (
          <div key={attached + idx} data-id={_id} className={`card card-box ${isAdmin && "card-box--admin"}`}>
            <Link to={isAdmin ? `admin/${name}` : name}>
              <div className="card-body">
                <h5 className="card-title card-box__title">{name}</h5>
                <h5 className="card-title card-box__subtitle">{attached}</h5>
              </div>
            </Link>
            <div className="icon-wrapper">
              <div className="icon-wrapper__icon--move"><FontAwesomeIcon icon={faBars} /></div>
              <div className="icon-wrapper__icon--delete" onClick={() => handleDeleteChurch({ id: _id, idx })}><FontAwesomeIcon icon={faTrashAlt} /></div>
            </div>
          </div>
        );
      })}

    </>
  );
};

const ChurchList = (props) => {
  const { match: { path }, modalOpend, church, attached, churches, changeCurrentInfo, sequenceChurch, removeChurch } = props
  const [isAdmin, setIsAdmin] = useState(false);
  const cardWrapper = useRef(null);
  const _isAdmin = path.match(/admin/);

  useEffect(() => {
    setIsAdmin(_isAdmin);
    changeCurrentInfo('attached', null);
    changeCurrentInfo('section', null);
    fetch('/api/church/all')
      .then(res => res.json())
      .then(res => {
        changeCurrentInfo('churches', res);
      });
  }, []);

  useEffect(() => {
    if (churches.length === 0) return;
    const el = document.querySelector('.card-wrapper');
    const sortable = new Sortable(
      el,
      {
        sort: true,
        delay: 0,
        animation: 150,
        handle: '.icon-wrapper__icon--move',
        onStart: function (/**Event*/evt) {
          cardWrapper.current.classList.add("sortabling");
        },
        onEnd: function ({ target }) {
          cardWrapper.current.classList.remove("sortabling");
          const idList = [...target.children].map(node => node.dataset.id);
          fetch('/api/church/seq', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              seq: JSON.stringify(idList)
            })
          }).then(res => res.json())
            .then(res => {
              console.log(res);
            });
        },
      });
    return () => sortable.destroy();
  }, [churches])

  const handleDeleteChurch = ({ id, idx }) => {
    handleToggleModal({
      inner: (
        <Modal>
          <ConfirmModal
            cancelAction={() => handleToggleModal({})}
            message="정말 삭제하시겠습니까?"
            confirmAction={() => {
              fetch(`/api/church/${id}`, {
                method: 'DELETE',
              }).then(res => res.json())
                .then(res => {
                  console.log(res);
                  removeChurch(idx);
                  res.ok && handleToggleModal({});
                });
            }
            } />
        </Modal>)
    })
  }

  const handleChange = (key, value) => {
    changeCurrentInfo(key, value);
  }

  const handleToggleModal = ({ inner }) => {
    console.log(inner);
    changeCurrentInfo('currentModal', !modalOpend ? inner : null);
    changeCurrentInfo('modalOpend', !modalOpend);
  }

  const addChurch = ({ church, attached, churches }) => {
    fetch('/api/church', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: church, attached })
    }).then(res => {
      handleToggleModal({});
      return res.json()
    }).then(res => {
      changeCurrentInfo('churches', [...churches, res]);
    });
  };

  return (
    <>
      <h3 className="title"><a href={isAdmin ? '/admin' : '/'}>교회 목록</a></h3>
      <div className="card-wrapper" ref={cardWrapper}>
        {spreadChurchList({ churches, isAdmin, handleToggleModal, handleChange, addChurch, church, attached, handleDeleteChurch })}
      </div>
      {isAdmin ? (
        <div
          className={`card card-box card-box--add`}
          onClick={() => handleToggleModal({
            inner: (
              <Modal>
                <ChurchForm handleChange={handleChange} confirmAction={addChurch} />
              </Modal>)
          })}>
          <div className="card-body">
            <div className="icon-plus blue w25" />
            <div className="card-box__p">페이지 추가</div>
          </div>
        </div>) : null}
    </>
  );
};

const mapStateToProps = state => ({
  insertedMember: state.inserted.insertedMember,
  churches: state.checker.churches,
  modalOpend: state.checker.modalOpend,
  attached: state.checker.attached
});

const mapDispatchToProps = dispatch => ({
  insertMemberData: (left, value) => dispatch(insertMemberData(left, value)),
  initMemberData: () => initMemberData(),
  changeCurrentInfo: (left, right) => dispatch(changeCurrentInfo(left, right)),
  sequenceChurch: (idx, seq) => dispatch(sequenceChurch(idx, seq)),
  removeChurch: (idx) => dispatch(removeChurch(idx))
});


export default connect(mapStateToProps, mapDispatchToProps)(ChurchList);