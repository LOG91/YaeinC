import React, { Component } from 'react';
import { CellTable } from '../components/CellTable';
import Tab from '../components/Tab/Tab';
import { attached, indexing, changeCurrentAttached, changeCurrentInfo, sheets, currentSheetId, networkCells } from '../store/modules/checker';
import { connect } from 'react-redux';

// import FortalModal from '../components/Modal/FortalModal';
import { Modal, FortalModal } from '../components/Modal';
import ConfirmModal from '../components/Modal/ConfirmModal';
import SheetForm from '../components/AddForm/SheetForm';

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
    modalAction: ''
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
    const sheets = await fetch(`/api/sheet/${attached}`).then(res => {
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
    const networkCells = await fetch(`api/networkCell/${currentSheetId}`).then(res => res.json()).then();
    const mapped = networkCells.map(v => v.name);
    changeCurrentInfo('networkCells', networkCells);
    fetch(`/api/cells/${JSON.stringify(mapped)}`)
      .then(res => res.json())
      .then(cells => {
        console.log(cells);
        changeCurrentInfo('currentSection', cells);
      });
  }

  async resetCheck() {
    const currentLocation = window.location.href;
    await fetch('/api/reset', {
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
    const html = document.querySelector('html');
    const tabDiv = document.querySelector('.tab');
    tabDiv.style.display = 'none';
    const printContents = document.querySelector('.container').innerHTML;
    const printDiv = document.createElement("DIV");
    printDiv.className = "print-div";

    html.appendChild(printDiv);
    printDiv.innerHTML = printContents;
    document.body.style.display = 'none';
    window.print();
    document.body.style.display = 'block';
    printDiv.style.display = 'none';
    tabDiv.style.display = 'flex';
  }

  handleToggleModal = ({ action }) => {
    this.setState({ modalAction: action });
    this.setState({ modalOpened: !this.state.modalOpened })
  }

  handleAddSheet = () => {
    this.handleToggleModal({ action: 'addSheet' });
  }

  render() {
    const { match, attached, sheets } = this.props;
    const isAdmin = match.url.match(/admin/g);
    return (
      <>
      <h3 className="title"><a href="/">Yaein 출석부</a>{isAdmin ? <div className="admin-title">admin</div> : null}</h3>
        {isAdmin ? (
          <div className="edit-box">
            <div className="button-box">
              {sheets.length === 0 ? (<div className="button-box__button--add-notify">시트를 추가하세요</div>) : null}
              <button className={`btn btn-outline-dark edit-box__button ${sheets.length===0 ? 'flashit':''}`} onClick={this.handleAddSheet}>시트 추가</button></div>
            <div className="button-box"><button className="btn btn-outline-dark edit-box__button" onClick={this.handlePrint}>프린트</button></div>
            <div className="button-box"><button className="btn btn-outline-dark edit-box__button" onClick={() => this.handleToggleModal({ action: 'init' })}>초기화</button></div>
          </div>
        ) : ''}
        <Tab idx={match.params.name} sheets={this.state.sheets} attached={attached} isAdmin={isAdmin ? true : null} />
        {match.path !== '/holy' && match.path !== '/bethel' ?
          <CellTable isAdmin={isAdmin} current={match.params.name} /> :
          <div>
            <div className="root__description">{match.path.match(/holy/g) ? 'HOLY' : '벧엘'}청년부 출석체크 페이지 :)</div>
            <div className="root__description">🇮🇱🇰🇷🇪🇬🇸🇾🇹🇷🇵🇸🇰🇵🇯🇴🇷🇺</div>
          </div>
        }
        {this.state.modalOpened ?
          <FortalModal>
            <Modal onToggleModal={this.handleToggleModal}>
              {this.state.modalAction === 'init' ? (<ConfirmModal confirmAction={this.resetCheck} />) :
                (<SheetForm />)}
            </Modal>
          </FortalModal> : null
        }
      </>
    )
  }
}
const mapStateToProps = (state) => ({
  currentSection: state.checker.currentSection,
  attached: state.checker.attached,
  sheets: state.checker.sheets,
  networkCells: state.checker.networkCells
});

const mapDispatchToProps = dispatch => ({
  indexing: idx => dispatch(indexing(idx)),
  changeCurrentInfo: (left, right) => dispatch(changeCurrentInfo(left, right)),
  changeCurrentAttached: attached => dispatch(changeCurrentAttached(attached))
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);