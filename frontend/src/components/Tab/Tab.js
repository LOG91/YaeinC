import React, { Component } from 'react';
import { increment, indexing, chageCurrentSection } from '../../store/modules/counter';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { cellData } from '../../data/cellData';
import './Tab.scss';

class Tab extends Component {
  handleClick = async (en_name) => {
    const { indexing, chageCurrentSection } = this.props;
    indexing(en_name);
    const initCells = cellData.find(v => v.en_name === en_name).cells;
    const currentCells = await fetch(`/api/cells/${JSON.stringify(initCells)}`).then(res => res.json());
    chageCurrentSection(currentCells);
  }

  render() {
    const { isAdmin } = this.props;
    return (
        <ul className="tab">
          {cellData.map((v, idx) =>{
            return <li key={idx} className={v.clsName} onClick={() => this.handleClick(v.en_name)}>
              <Link to={`/cell/${v.en_name}`} className={this.props.idx === v.en_name ? "active" : ""}>{v.name}</Link>
          </li>})}
          {isAdmin ? <li key={cellData.length} className="index">
              <Link to="/admin">셀원 추가</Link>
          </li> : null}
        </ul>
    )
  }
}

const mapStateToProps = (state) => ({
  number: state.number,
  idx: state.idx,
  currentSection: state.currentSection
});

const mapDispatchToProps = dispatch => ({
  increment: () => dispatch(increment()),
  indexing: idx => dispatch(indexing(idx)),
  chageCurrentSection: (section, enName) => dispatch(chageCurrentSection(section, enName))
})

export default connect(mapStateToProps, mapDispatchToProps)(Tab);