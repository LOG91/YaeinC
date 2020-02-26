/*eslint-disable */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { changeCurrentInfo } from '../../store/modules/checker';
import { insertMemberData, initMemberData } from '../../store/modules/inserted';

import { Modal } from '../Modal'
import ChurchForm from '../AddForm/ChurchForm';

const spreadChurchList = ({ churches, isAdmin, handleToggleModal, handleChange, addChurch }) => {

  return (
    <>
      {churches.map(({ name, attached }, idx) => {
        return (
          <div key={attached + idx} className="card card-box">
            <a href={isAdmin ? `admin/${name}` : name}>
              <div className="card-body">
                <h5 className="card-title card-box__title">{name}</h5>
                <h5 className="card-title card-box__subtitle">{attached}</h5>
              </div>
            </a>
          </div>
        );
      })}
      {isAdmin ? (
        <div
          className="card card-box"
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

const ChurchList = (props) => {
  const { match: { path }, modalOpend, church, attached, churches, changeCurrentInfo } = props

  useEffect(() => {
    fetch('/api/church/all')
      .then(res => res.json())
      .then(res => changeCurrentInfo('churches', res));
  }, []);

  const isAdmin = path.match(/admin/) ? true : false;
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
      <div className="card-wrapper">
        {spreadChurchList({ churches, isAdmin, handleToggleModal, handleChange, addChurch, church, attached })}
      </div>
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