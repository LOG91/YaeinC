import React, { Component } from 'react';
import { CellTable } from '../components/CellTable';
import Tab from '../components/Tab/Tab';
import { cellData } from '../data/cellData';
import { attached, indexing, changeCurrentSection, changeCurrentAttached, changeCurrentInfo } from '../store/modules/checker';
import { connect } from 'react-redux';

import FortalModal from '../components/Modal/FortalModal';
import Modal from '../components/Modal/Modal';
import ConfirmModal from '../components/Modal/ConfirmModal';

class Home extends Component {
  state = {
    modalOpened: false
  }
  mapSectionByEnName(enName) {
    const section =
      enName.match(/israel/g) ?
        '이스라엘군' : enName.match(/arab/g) ?
          '아랍군' : enName.match(/asia/g) ? '아시아군'
            : null;

    return section;
  }
  shouldComponentUpdate() {
    const { match, changeCurrentSection, indexing, changeCurrentInfo } = this.props;
    const { name: current, attached } = match.params;
    if (match.path === '/holy' || match.path === '/bethel') {
      changeCurrentInfo('attached', match.path.slice(1));
      return true;
    }
    changeCurrentInfo('idx', current);
    changeCurrentInfo('section', this.mapSectionByEnName(current));
    changeCurrentInfo('attached', attached);
    return true;
  }
  componentDidMount() {
    const { match, changeCurrentSection, indexing, changeCurrentInfo } = this.props;
    const { name: current, attached } = match.params;
    if (match.path === '/holy' || match.path === '/bethel') {
      changeCurrentInfo('attached', match.path.slice(1));
      return;
    }
    changeCurrentInfo('idx', current);
    changeCurrentInfo('section', this.mapSectionByEnName(current));
    changeCurrentInfo('attached', attached);
    const initCells = cellData.find(v => v.en_name === current).cells;
    fetch(`/api/cells/${JSON.stringify(initCells)}`)
      .then(res => res.json())
      .then(cells => {
        changeCurrentSection(cells);
      })
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

  handleToggleModal = param => {
    param ? this.setState({ modalOpened: false }) :
      this.setState({ modalOpened: !this.state.modalOpened })
  }

  handleAddSheet = () => {
      
  }

  render() {
    const { match, attached } = this.props;
    const isAdmin = match.url.match(/admin/g);
    return (
      <div>
        {isAdmin ? (
          <div className="edit-box">
            <div className="button-box"><button className="edit-box__button--print" onClick={this.handleAddSheet}>시트 추가</button></div>
            <div className="button-box"><button className="edit-box__button--print" onClick={this.handlePrint}>프린트</button></div>
            <div className="button-box"><button className="edit-box__button--init" onClick={() => this.handleToggleModal()}>초기화</button></div>
          </div>
        ) : ''}
        <Tab idx={match.params.name} attached={attached} isAdmin={isAdmin ? true : null} />
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
              <ConfirmModal confirmAction={this.resetCheck} />
            </Modal>
          </FortalModal> : null
        }
      </div>
    )
  }
}
const mapStateToProps = (state) => ({
  currentSection: state.checker.currentSection,
  attached: state.checker.attached
});

const mapDispatchToProps = dispatch => ({
  indexing: idx => dispatch(indexing(idx)),
  changeCurrentInfo: (left, right) => dispatch(changeCurrentInfo(left, right)),
  changeCurrentSection: (section, enName) => dispatch(changeCurrentSection(section, enName)),
  changeCurrentAttached: attached => dispatch(changeCurrentAttached(attached))
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);