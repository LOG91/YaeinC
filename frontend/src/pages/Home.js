import React, { Component } from 'react';
import { CellTable } from '../components/CellTable';
import Tab from '../components/Tab/Tab';
import { cellData } from '../data/cellData';
import { indexing, changeCurrentSection } from '../store/modules/checker';
import { connect } from 'react-redux';

class Home extends Component {

  componentDidUpdate(prevProps) {
    // console.log(this.props);
    const { match, changeCurrentSection, currentSection } = this.props;
    console.log(currentSection);
    if (prevProps.currentSection === currentSection) {
      console.log(match, '매치');
      console.log(changeCurrentSection, '체인지커런트섹션');
      console.log(currentSection, '커런트섹션');

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
  //  ({ match, changeCurrentSection, currentSection }) => {
  render() {

    // debugger;
    const { match } = this.props;
    return (
      <div>
        <Tab isAdmin={match.path === '/admin' ? true : null} />
        {match.path !== '/' ?
          <CellTable current={match.params.name} /> : <h2>예인교회 출석부</h2>}
      </div>
    )
    //   console.log(match.params.name, '매치');
    //   console.log(currentSection, '커런트섹션');
    //   if(match.params.name)

    // changeCurrentSection(currentCells);


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