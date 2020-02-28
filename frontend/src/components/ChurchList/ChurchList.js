/*eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sortable from 'sortablejs';
import './ChurchList.scss';

import { changeCurrentInfo } from '../../store/modules/checker';
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
  const { match: { path }, modalOpend, church, attached, churches, changeCurrentInfo } = props

  const [isAdmin, setIsAdmin] = useState(false);
  const cardWrapper = useRef(null);

  useEffect(() => {
    const _isAdmin = path.match(/admin/);
    setIsAdmin(_isAdmin);
    if (_isAdmin) {
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
          onEnd: (evt) => {
            cardWrapper.current.classList.remove("sortabling");
            console.log(evt)
          },
        });
    }

    fetch('/api/church/all')
      .then(res => res.json())
      .then(res => changeCurrentInfo('churches', res));
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
  church: state.checker.church,
  attached: state.checker.attached
});

const mapDispatchToProps = dispatch => ({
  insertMemberData: (left, value) => dispatch(insertMemberData(left, value)),
  initMemberData: () => initMemberData(),
  changeCurrentInfo: (left, right) => dispatch(changeCurrentInfo(left, right))
});


export default connect(mapStateToProps, mapDispatchToProps)(ChurchList);