import React, { useEffect, PureComponent } from 'react';
import { connect, useStore } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { changeCurrentInfo, modalOpend } from '../store/modules/checker';
import { insertMemberData, initMemberData } from '../store/modules/inserted';

import { Modal, FortalModal } from '../components/Modal'
import ChurchForm from '../components/AddForm/ChurchForm';

import { Layout } from '../pages/Layout';
import { Footer } from '../components/Footer';
import { Header, AdminHeader } from '../components/Header';
import { Home, Youth } from '../pages';
import { ChurchList } from '../components/ChurchList';

const spreadChurchList = ({ churches, isAdmin, handleToggleModal, handleChange, addChurch }) => {

  return (
    <>
      {churches.map(({ name, attached }) => {
        return (
          <div className="card card-box">
            <a href={isAdmin ? `admin/${name}` : name}>
              <div className="card-body">
                <h5 className="card-title card-box__title">{name}</h5>
                <h5 className="card-title card-box__subtitle">{attached}</h5>
              </div>
            </a>
          </div>
        )
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

const Main = (props) => {
  const { match: { path }, modalOpend, church, attached, churches, changeCurrentInfo } = props
  console.log(props);

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
    console.log(church);
    // const { church, attached, churches } = props;
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
    })
  }

  return (
    <>
      <BrowserRouter>
        <Layout Header={Header} Footer={Footer}>
          <div className="main-container">
            <Switch>
              <Route exact path="/" component={ChurchList} />
              <Route exact path="/:attached" component={Home} />
              <Route path="/:attached/:name" component={Home} />
            </Switch>
          </div>
        </Layout>
      </BrowserRouter>
    </>
  );
}

const mapStateToProps = state => ({
  insertedMember: state.inserted.insertedMember,
  churches: state.checker.churches,
  modalOpend: state.checker.modalOpend,
  church: state.checker.church,
  attached: state.checker.attached
})

const mapDispatchToProps = dispatch => ({
  insertMemberData: (left, value) => dispatch(insertMemberData(left, value)),
  initMemberData: () => initMemberData(),
  changeCurrentInfo: (left, right) => dispatch(changeCurrentInfo(left, right))
})

export default connect(mapStateToProps, mapDispatchToProps)(Main);