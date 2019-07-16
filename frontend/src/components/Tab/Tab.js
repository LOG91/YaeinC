import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { increment, indexing, chageCurrentSection } from '../../store/modules/counter';
import { connect } from 'react-redux';
import './Tab.scss';

const mapCellName = {
  israel_1: ['israel_ga', 'israel_na', 'israel_da'],
  israel_2: ['jerusalem_ga', 'palestine', 'israel', 'jerusalem'],
  arab_1: ['syria_ga', 'syria_na', 'syria'],
  arab_2: ['jordan', 'egypt'],
  russia: ['russia_m', 'russia_w'],
  turkey: ['antioch', 'turkey', 'istanbul'],
}

const tabData = [
  { en_name: 'israel_1', cells: mapCellName['israel_1'], name: '이스라엘군1', to: '/israel_1', activeStyle: true, clsName: 'index'},
  { en_name: 'israel_2', cells: mapCellName['israel_2'], name: '이스라엘군2', to: '/israel_2', activeStyle: true, clsName: 'index'},
  { en_name: 'arab_1', cells: mapCellName['arab_1'], name: '아랍군1', to: '/arab_1', activeStyle: true, clsName: 'index'},
  { en_name: 'arab_2', cells: mapCellName['arab_2'], name: '아랍군2', to: '/arab_2', activeStyle: true, clsName: 'index'},
  { en_name: 'turkey', cells: mapCellName['turkey'], name: '터키군', to: '/turkey', activeStyle: true, clsName: 'index'},
  { en_name: 'russia', cells: mapCellName['russia'], name: '연해주', to: '/russia', activeStyle: true, clsName: 'index'},
  { en_name: 'youth_m', name: '청년예배(남)', cells: [], to: '/youth_man', activeStyle: true, clsName: 'index'},
  { en_name: 'youth_w', name: '청년예배(여)', cells: [], to: '/posts', activeStyle: true, clsName: 'index'}
];

class Tab extends Component {

  handleClick = async (e, cells, en_name) => {
    const { chageCurrentSection, indexing } = this.props;
    console.log('inserted cells: ', cells);
    const info = await Promise.all(cells.map(item => fetch(`/api/section/${item}`).then(res=>res.json())));
    chageCurrentSection(info, en_name);
    indexing(en_name);
  }
  render() {
    const activeStyle = {
      borderBottom: '1px solid #9775fa',
      color: '#9775fa'
    }

    return (
      <ul className="tab">
        {tabData.map((v, idx) =>{
          console.log(v.en_name, this.props.idx, 897)
          return <li key={idx} className={v.clsName} onClick={e => this.handleClick(e, v.cells, v.en_name)}>
            <a href="#" className={this.props.idx === v.en_name ? "active" : ""}>{v.name}</a>
        </li>})}
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