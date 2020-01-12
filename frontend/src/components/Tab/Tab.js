import React, { Component } from 'react';
import { indexing, changeCurrentInfo, sheets } from '../../store/modules/checker';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Tab.scss';

class Tab extends Component {
  
  handleClick = async (sheetName) => {
    const { indexing, changeCurrentInfo, sheets } = this.props;
    indexing(sheetName);
    const currentSheetId = sheets.length && sheets.find(v => v.name === sheetName)._id;
    changeCurrentInfo('currentSheetId', currentSheetId);
    const networkCells = await fetch(`api/networkCell/${currentSheetId}`).then(res => res.json()).then();
    const mapped = networkCells.map(v => v.name);
    changeCurrentInfo('networkCells', networkCells);
    fetch(`/api/cells/${JSON.stringify(mapped)}`)
      .then(res => res.json())
      .then(cells => {
        changeCurrentInfo('currentSection', cells);
      });
  }

  render() {
    const { isAdmin, attached, sheets } = this.props;
    return (
        <ul className="tab">
          {sheets.map((v, idx) =>{
            return <li key={idx} className="index">
              <Link to={`/${isAdmin ? 'admin/' : ''}${attached}/${v.name}`} onClick={() => this.handleClick(v.name)} className={this.props.idx === v.name ? "active" : ""}>{v.name}</Link>
          </li>})}
        </ul>
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
  increment: () => dispatch(increment()),
  indexing: idx => dispatch(indexing(idx)),
  changeCurrentInfo: (left, right) => dispatch(changeCurrentInfo(left, right))
});

export default connect(mapStateToProps, mapDispatchToProps)(Tab);