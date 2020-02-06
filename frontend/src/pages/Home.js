import React, { Component } from 'react';
import { CellTable } from '../components/CellTable';
import Tab from '../components/Tab/Tab';
import { attached, changeCurrentInfo, sheets, currentSheetId, networkCells } from '../store/modules/checker';
import { connect } from 'react-redux';

import { Modal } from '../components/Modal';
import ConfirmModal from '../components/Modal/ConfirmModal';
import SheetForm from '../components/AddForm/SheetForm';

import { printTargetNode } from '../fn/fn';

const mapSectionByEnName = (enName) => {
  const section =
    enName.match(/이스라엘/g) ?
      '이스라엘군' : enName.match(/아랍/g) ?
        '아랍군' : enName.match(/아시아/g) ? '아시아군'
          : null;

  return section;
}
class Home extends Component {
  state = {
    modalOpened: false,
    modalAction: '',
    currentModal: null
  }

  shouldComponentUpdate() {
    const { match, changeCurrentInfo, sheets } = this.props;
    const { name: current, attached } = match.params;
    if (!current) {
      changeCurrentInfo('attached', attached);
      return true;
    }
    changeCurrentInfo('idx', current);
    sheets.length && changeCurrentInfo('currentSheetId', sheets.find(v => v.name === current)._id);
    changeCurrentInfo('section', mapSectionByEnName(current));

    changeCurrentInfo('attached', attached);
    return true;
  }
  async componentDidMount() {
    const { match, changeCurrentInfo } = this.props;
    const { name: current, attached } = match.params;
    changeCurrentInfo('attached', attached);
    const sheets = await fetch(`http://localhost:7000/api/sheet/${attached}`).then(res => {
      return res;
    }).then(res => res.json())
      .then();
    changeCurrentInfo('sheets', sheets);
    if (!current) {
      return;
    }
    changeCurrentInfo('idx', current);
    changeCurrentInfo('section', mapSectionByEnName(current));
    changeCurrentInfo('attached', attached);
    const currentSheetId = sheets.length && sheets.find(v => v.name === current)._id;
    changeCurrentInfo('currentSheetId', currentSheetId);
    const networkCells = await fetch(`http://localhost:7000/api/networkCell/${currentSheetId}`).then(res => res.json()).then();
    const mapped = networkCells.map(v => v.name);
    changeCurrentInfo('networkCells', networkCells);
    fetch(`http://localhost:7000/api/cells/${JSON.stringify(mapped)}`)
      .then(res => res.json())
      .then(cells => {
        changeCurrentInfo('currentSection', cells);
      });
  }

  async resetCheck() {
    const currentLocation = window.location.href;
    await fetch('http://localhost:7000/api/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentLocation })
    }).then(() => {
      window.location.href = window.location.href;
    });
  }

  handlePrint() {
    printTargetNode({
      targetSelector: '.admin-table',
      nonDisplaySelector: ['.networkName-box'],
      nonDisplaySelectorAll: ['.cell-table__td__button', '.network-box__button']
    })
  }

  handleToggleModal = ({ inner }) => {
    const { changeCurrentInfo, modalOpend } = this.props;
    changeCurrentInfo('currentModal', !modalOpend ? inner : null);
    changeCurrentInfo('modalOpend', !modalOpend);
  }

  render() {
    const { match, attached, sheets } = this.props;
    const isAdmin = match.url.match(/admin/g);
    return (
      <>
        <h3 className="title"><a href={isAdmin ? '/admin' : '/'}>Yaein 출석부</a>{isAdmin ? <div className="admin-title">admin</div> : null}</h3>
        {isAdmin ? (
          <div className="edit-box">
            <div className="button-box">
              {sheets.length === 0 ? (<div className="button-box__button--add-notify">시트를 추가하세요</div>) : null}
              <button
                className={`btn btn-outline-dark button-box__button ${sheets.length === 0 ? 'flashit' : ''}`}
                onClick={() => this.handleToggleModal({ inner: <Modal onToggleModal={this.handleToggleModal}><SheetForm /></Modal> })}>시트 추가</button></div>
            <div className="button-box">
              <button
                className="btn btn-outline-dark button-box__button"
                onClick={this.handlePrint}>
                프린트
                </button>
            </div>
            <div className="button-box">
              <button
                className="btn btn-outline-dark button-box__button"
                onClick={() => this.handleToggleModal({ inner: <Modal onToggleModal={this.handleToggleModal}><ConfirmModal message="출석정보를 초기화하시겠습니까?" confirmAction={this.resetCheck} /></Modal> })}>
                초기화
                </button>
            </div>
          </div>
        ) : ''}
        <Tab idx={match.params.name} sheets={this.state.sheets} attached={attached} isAdmin={isAdmin ? true : null} />
        {match.params.name ?
          <div className="admin-table"><CellTable isAdmin={isAdmin} current={match.params.name} /></div> :
          <div>
            <div className="root__description">{attached} 출석체크 페이지 :)</div>
            <div className="root__description">🇮🇱🇰🇷🇪🇬🇸🇾🇹🇷🇵🇸🇰🇵🇯🇴🇷🇺</div>
          </div>
        }
      </>
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
  changeCurrentInfo: (left, right) => dispatch(changeCurrentInfo(left, right)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);