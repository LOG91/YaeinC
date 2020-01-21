import React, { PureComponent } from 'react';
import './Main.scss'

import { connect } from 'react-redux';
import { insertMemberData, initMemberData, insertedMember, changeCurrentInfo } from '../store/modules/checker';
import { Modal, FortalModal } from '../components/Modal'
import ChurchForm from '../components/AddForm/ChurchForm';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';


class Main extends PureComponent {
  state = {
    modalOpend: false
  };

  async componentDidMount() {
    const { changeCurrentInfo } = this.props;
    const churchList = await fetch('/api/church/all').then(res => res.json()).then();
    changeCurrentInfo('currentChurches', churchList);
  }

  addChurch = () => {
    const { insertedMember: { church } } = this.props;
    fetch('/api/church', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: church })
    }).then(res => {
      console.log(res);
    })
  }
  handleChange = (key, value) => {
    this.props.insertMemberData(key, value);
  }

  spreadChurchList = ({ churches, isAdmin }) => {
    return (
      <>
        {churches.map(church => {
          return (
            <div className="card card-box" style={{ "width": "18rem" }}>
              <a href={isAdmin ? `admin/${church}` : church}>
                <div className="card-body">
                  <h5 className="card-title card-box__title">{church}</h5>
                  <h5 className="card-title card-box__subtitle">청년부</h5>
                  {/* <a href="#" className="btn btn-outline-dark">출석체크</a> */}
                </div>
              </a>
            </div>
          )
        })}
        <div className="card card-box" style={{ "width": "18rem" }}>
          <div className="card-body">
            <div className="icon-plus blue w25" />
            <div className="card-box__p" onClick={this.handleToggleModal}>페이지 추가</div>
          </div>
        </div>
      </>
    );
  };
  handleToggleModal = () => {
    this.setState({ modalOpend: !this.state.modalOpend });
  }

  render() {
    const { match: { path }, currentChurches } = this.props;
    const isAdmin = path.match(/admin/) ? true : false;
    return (
      <>
        <h3 className="title"><a href="/">Yaein 출석부</a>{isAdmin ? <div className="admin-title">admin</div> : null}</h3>
        <div className="card-wrapper">
          {this.spreadChurchList({ churches: currentChurches.map(v => v.name), isAdmin })}
        </div>
        {this.state.modalOpend ?
          (<FortalModal>
            <Modal onToggleModal={this.handleToggleModal}>
              <ChurchForm handleChange={this.handleChange} confirmAction={() => this.addChurch()} />
            </Modal>
          </FortalModal>) : null
        }
      </>
    );
  };
};

const mapStateToProps = state => ({
  insertedMember: state.checker.insertedMember,
  currentChurches: state.checker.currentChurches
})

const mapDispatchToProps = dispatch => ({
  insertMemberData: (left, value) => dispatch(insertMemberData(left, value)),
  initMemberData: () => initMemberData(),
  changeCurrentInfo: (left, right) => dispatch(changeCurrentInfo(left, right))
})

export default connect(mapStateToProps, mapDispatchToProps)(Main);