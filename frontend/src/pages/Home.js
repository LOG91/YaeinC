import React, { Component } from 'react';
import { CellTable } from '../components/CellTable';
import Tab from '../components/Tab/Tab';
import { cellData } from '../data/cellData';
import { indexing, changeCurrentSection } from '../store/modules/checker';
import { connect } from 'react-redux';

class Home extends Component {
  componentDidMount() {
    const { match, changeCurrentSection } = this.props;
    console.log(this.props);
    const { name: current } = match.params;
    // console.log(this.props.match.params);
    console.log(match.path);
    if (match.path !== '/') {
      const initCells = cellData.find(v => v.en_name === current).cells;
      fetch(`/api/cells/${JSON.stringify(initCells)}`)
        .then(res => res.json())
        .then(cells => {
          console.log(cells);
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
          console.log(cells);
          changeCurrentSection(cells);
        })
    }
  }

  render() {
    const { match } = this.props;
    console.log(match, 2222);
    return (
      <div>
        <Tab idx={match.params.name} isAdmin={match.path === '/admin' ? true : null} />
        {match.path !== '/' ?
          <CellTable current={match.params.name} /> : <p className="root__description">예인청년 출석체크 페이지 :)</p>}
      </div>
    )
  }
}
const mapStateToProps = (state) => ({
  idx: state.checker.idx,
  currentSection: state.checker.currentSection
});

const mapDispatchToProps = dispatch => ({
  indexing: idx => dispatch(indexing(idx)),
  changeCurrentSection: (section, enName) => dispatch(changeCurrentSection(section, enName))
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);