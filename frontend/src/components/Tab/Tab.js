import React, { Component } from 'react';
import { increment, indexing, chageCurrentSection } from '../../store/modules/counter';
import { connect } from 'react-redux';
import { BrowserRouter, Link } from 'react-router-dom';
import { cellData } from '../../data/cellData';
import './Tab.scss';

class Tab extends Component {

  handleClick = async (e, cells, en_name) => {
    const { chageCurrentSection, indexing } = this.props;
    console.log('inserted cells: ', cells);
    const info = await Promise.all(cells.map(item => fetch(`/api/section/${item}`).then(res=>res.json())));
    chageCurrentSection(info, en_name);
    indexing(en_name);
  }
  render() {
    return (
      <BrowserRouter>
        <ul className="tab">
          {cellData.map((v, idx) =>{
            console.log(v.en_name, 897)
            return <li key={idx} className={v.clsName} onClick={e => this.handleClick(e, v.cells, v.en_name)}>
              <Link to={`/${v.en_name}`} className={this.props.idx === v.en_name ? "active" : ""}>{v.name}</Link>
          </li>})}
        </ul>
      </BrowserRouter>
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