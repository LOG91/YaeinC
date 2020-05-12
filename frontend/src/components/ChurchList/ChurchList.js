/*eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import Sortable from 'sortablejs';
import './ChurchList.scss';

import { removeChurch, changeCurrentInfo } from '../../store/modules/checker';

import { Modal, ConfirmModal } from '../Modal'
import ChurchForm from '../AddForm/ChurchForm';
import ChurchCardBox from './ChurchCardBox';
import { CHURCH_FORM_NAME_EMPTY } from '../../store/modules/emptyCheck';


const ChurchList = (props) => {
  const { match: { path } } = props;
  const dispatch = useDispatch();
  const { churches, modalOpend } = useSelector(state => state.checker);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmptyName, setIsEmptyName] = useState(false);
  const cardWrapper = useRef(null);
  const _isAdmin = path.match(/admin/);

  useEffect(() => {
    setIsAdmin(_isAdmin);
    dispatch(changeCurrentInfo('attached', null));
    dispatch(changeCurrentInfo('section', null));
    fetch('/api/church/all')
      .then(res => res.json())
      .then(res => {
        dispatch(changeCurrentInfo('churches', res));
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
                  dispatch(removeChurch(idx));
                  res.ok && handleToggleModal({});
                });
            }
            } />
        </Modal>)
    })
  }

  const handleChange = (key, value) => {
    if (value.trim() !== '') dispatch({ type: CHURCH_FORM_NAME_EMPTY, right: false });
    dispatch(changeCurrentInfo(key, value));
  }

  const handleToggleModal = ({ inner }) => {
    dispatch(changeCurrentInfo('currentModal', !modalOpend ? inner : null));
    dispatch(changeCurrentInfo('modalOpend', !modalOpend));
  }

  const addChurch = ({ church, attached, churches }) => {
    if (church.trim() === '') {
      dispatch({ type: CHURCH_FORM_NAME_EMPTY, right: true });
      return;
    }
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
      dispatch(changeCurrentInfo('churches', [...churches, res]));
    });
  };

  return (
    <>
      <h3 className="title"><a href={isAdmin ? '/admin' : '/'}>교회 목록</a></h3>
      <div className="card-wrapper" ref={cardWrapper}>
        <ChurchCardBox churches={churches} isAdmin={isAdmin} handleDeleteChurch={handleDeleteChurch} />
      </div>
      {isAdmin ? (
        <div
          className={`card card-box card-box--add`}
          onClick={() => handleToggleModal({
            inner: (
              <Modal>
                <ChurchForm isEmptyName={isEmptyName} handleChange={handleChange} confirmAction={addChurch} />
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


export default ChurchList;