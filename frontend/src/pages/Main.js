import React, { PureComponent } from 'react';
import './Main.scss'

import { connect } from 'react-redux';
import { insertMemberData, initMemberData, insertedMember, changeCurrentInfo } from '../store/modules/checker';
import { Modal, FortalModal } from '../components/Modal'
import ChurchForm from '../components/AddForm/ChurchForm';

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

  spreadChurchList = (churchList) => {
    return (
      <>
        {churchList.map(church => {
          return (
            <div className="card" style={{ "width": "18rem" }}>
              <div className="card-body">
                <h5 className="card-title">{church}</h5>
                <a href="#" className="btn btn-outline-dark">출석체크</a>
              </div>
            </div>
          )
        })}
        <div className="card" style={{ "width": "18rem" }}>
          <div className="card-body">
            <h5 className="card-title">페이지 추가</h5>
            <a href="#" className="btn btn-outline-dark" onClick={this.handleToggleModal}>페이지 추가</a>
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
    return (
      <>
        <div className="card-wrapper">
          {this.spreadChurchList(currentChurches.map(v => v.name))}
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