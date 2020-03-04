/*eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sortable from 'sortablejs';
import './ChurchList.scss';

import { changeCurrentInfo, sequenceChurch } from '../../store/modules/checker';
import { insertMemberData, initMemberData } from '../../store/modules/inserted';

import { Modal } from '../Modal'
import ChurchForm from '../AddForm/ChurchForm';

const spreadChurchList = ({ churches, isAdmin, handleToggleModal, handleChange, addChurch }) => {

  return (
    <>
      {churches.map(({ name, attached }, idx) => {
        return (
          <div key={attached + idx} className={`card card-box ${isAdmin && "card-box--admin"}`}>
            <Link to={isAdmin ? `admin/${name}` : name}>
              <div className="card-body">
                <h5 className="card-title card-box__title">{name}</h5>
                <h5 className="card-title card-box__subtitle">{attached}</h5>
              </div>
            </Link>
          </div>
        );
      })}

    </>
  );
};

const ChurchList = (props) => {
  const { match: { path }, modalOpend, church, attached, churches, changeCurrentInfo, sequenceChurch } = props

  const [isAdmin, setIsAdmin] = useState(false);
  const cardWrapper = useRef(null);
  const _isAdmin = path.match(/admin/);
  useEffect(() => {
    if (churches.length === 0) return;
    const el = document.querySelector('.card-wrapper');
    const sortable = new Sortable(
      el,
      {
        sort: true,
        delay: 0,
        animation: 150,
        onStart: function (/**Event*/evt) {
          cardWrapper.current.classList.add("sortabling");
          console.log(evt);
        },
        onEnd: function (evt) {
          console.log(churches);
          cardWrapper.current.classList.remove("sortabling");
          const { oldIndex, newIndex } = evt;
          const prev = churches[oldIndex];
          const now = churches[newIndex];
          fetch('/api/church/seq', {
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
              console.log(res)
              sequenceChurch(oldIndex, res.seq);
              fetch('/api/church/seq', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  _id: now._id,
                  seq: prev.seq
                })
              }).then(res => res.json())
                .then(res => sequenceChurch(newIndex, res.seq));
            });
        },
      });
    return () => sortable.destroy();
  }, [churches])
  useEffect(() => {
    setIsAdmin(_isAdmin);

    fetch('/api/church/all')
      .then(res => res.json())
      .then(res => {
        changeCurrentInfo('churches', res);
      });
  }, []);



  const handleChange = (key, value) => {
    changeCurrentInfo(key, value);
  }

  const handleToggleModal = ({ inner }) => {
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
        {spreadChurchList({ churches, isAdmin, handleToggleModal, handleChange, addChurch, church, attached })}
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
  sequenceChurch: (idx, seq) => dispatch(sequenceChurch(idx, seq))
});


export default connect(mapStateToProps, mapDispatchToProps)(ChurchList);