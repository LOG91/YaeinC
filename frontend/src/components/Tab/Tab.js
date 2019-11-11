import React, { Component } from 'react';
import { indexing, changeCurrentSection } from '../../store/modules/checker';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { cellData } from '../../data/cellData';
import './Tab.scss';

class Tab extends Component {
  
  handleClick = async (en_name) => {
    const { indexing, changeCurrentSection } = this.props;
    indexing(en_name);
    const initCells = cellData.find(v => v.en_name === en_name).cells;
      fetch(`/api/cells/${JSON.stringify(initCells)}`)
        .then(res => res.json())
        .then(cells => {
          changeCurrentSection(cells);
        })
  }

  render() {
    const { isAdmin } = this.props;
    return (
        <ul className="tab">
          {cellData.map((v, idx) =>{
            return <li key={idx} className={v.clsName}>
              <Link to={`/${isAdmin ? 'admin/' : ''}${v.path}`} onClick={() => this.handleClick(v.en_name)} className={this.props.idx === v.en_name ? "active" : ""}>{v.name}</Link>
          </li>})}
        </ul>
    )
  }
}

const mapStateToProps = (state) => ({
  currentSection: state.checker.currentSection
});

const mapDispatchToProps = dispatch => ({
  increment: () => dispatch(increment()),
  indexing: idx => dispatch(indexing(idx)),
  changeCurrentSection: (section, enName) => dispatch(changeCurrentSection(section, enName))
});

export default connect(mapStateToProps, mapDispatchToProps)(Tab);