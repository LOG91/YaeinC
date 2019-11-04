import React, { Component } from 'react';
import { CellTable } from '../components/CellTable';
import Tab from '../components/Tab/Tab';
import { cellData } from '../data/cellData';
import { indexing, changeCurrentSection } from '../store/modules/checker';
import { connect } from 'react-redux';

class Home extends Component {
  componentDidMount() {
    const { match, changeCurrentSection } = this.props;
    const { name: current } = match.params;
    if (match.path !== '/') {
      const initCells = cellData.find(v => v.en_name === current).cells;
      fetch(`/api/cells/${JSON.stringify(initCells)}`)
        .then(res => res.json())
        .then(cells => {
          changeCurrentSection(cells);
        })
    }
  }
  componentDidUpdate(prevProps) {
    const { match, changeCurrentSection, currentSection } = this.props;
    if (match.path === '/') return;
    if (prevProps.currentSection === currentSection) {
      const { name: current } = match.params;
      const initCells = cellData.find(v => v.en_name === current).cells;
      fetch(`/api/cells/${JSON.stringify(initCells)}`)
        .then(res => res.json())
        .then(cells => {
          changeCurrentSection(cells);
        })
    }
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

  render() {
    const { match } = this.props;
    const isAdmin = match.path.match(/admin/g);
    console.log(isAdmin,123123);
    return (
      <div>
        {isAdmin ? (<div className="edit-box">
          <div className="button-box"><button className="edit-box__button--print" onClick={this.handlePrint}>프린트</button></div>
          <div className="button-box"><button className="edit-box__button--init" onClick={this.resetCheck}>초기화</button></div>
        </div>) : ''}
        <Tab idx={match.params.name} isAdmin={isAdmin ? true : null} />
        {match.path !== '/' ?
          <CellTable isAdmin={isAdmin} current={match.params.name} /> : 
          <div>
            <div className="root__description">예인청년 출석체크 페이지 :)</div>
            <div className="root__description">🇮🇱🇪🇬🇸🇾🇰🇷🇹🇷🇵🇸🇰🇵🇯🇴🇷🇺</div>
          </div>
          
          }
      </div>
    )
  }
}
const mapStateToProps = (state) => ({
  currentSection: state.checker.currentSection
});

const mapDispatchToProps = dispatch => ({
  indexing: idx => dispatch(indexing(idx)),
  changeCurrentSection: (section, enName) => dispatch(changeCurrentSection(section, enName))
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);