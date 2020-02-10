import React, { Component } from 'react';
import { changeCurrentInfo, sheets } from '../../store/modules/checker';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Tab.scss';

class Tab extends Component {
  
  handleClick = async (sheetName) => {
    const { changeCurrentInfo, sheets } = this.props;
    const currentSheetId = sheets.length && sheets.find(v => v.name === sheetName)._id;
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

  render() {
    const { isAdmin, attached, sheets, currentSheet } = this.props;
    return (
        <ul className="tab">
          {sheets.map((v, idx) =>{
            return <li key={idx} className={currentSheet === v.name ? "index active" : "index"}>
              <Link to={`/${isAdmin ? 'admin/' : ''}${attached}/${v.name}`} onClick={() => this.handleClick(v.name)} >{v.name}</Link>
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
  changeCurrentInfo: (left, right) => dispatch(changeCurrentInfo(left, right))
});

export default connect(mapStateToProps, mapDispatchToProps)(Tab);