import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { increment, indexing } from '../store/modules/counter';
import { connect } from 'react-redux';


const tabData = [
  { en_name: 'israel_1', name: '이스라엘군1', to: '/israel_1', activeStyle: true, clsName: 'index'},
  { en_name: 'israel_2', name: '이스라엘군2', to: '/israel_2', activeStyle: true, clsName: 'index'},
  { en_name: 'arab_1', name: '아랍군1', to: '/arab_1', activeStyle: true, clsName: 'index'},
  { en_name: 'arab_2', name: '아랍군2', to: '/arab_2', activeStyle: true, clsName: 'index'},
  { en_name: 'turkey', name: '터키군', to: '/turkey', activeStyle: true, clsName: 'index'},
  { en_name: 'russia', name: '연해주', to: '/russia', activeStyle: true, clsName: 'index'},
  { name: '청년예배(남)', to: '/youth_man', activeStyle: true, clsName: 'index'},
  { name: '청년예배(여)', to: '/posts', activeStyle: true, clsName: 'index'}
];

const MakeTab = tabList => {
  tabList.reduce
}

class Tab extends Component {
  handleClick = (e, to) => {
    const { increment, indexing } = this.props;
    console.log(to);
    increment();
    indexing(to);
  }
  render() {
    const activeStyle = {
      borderBottom: '1px solid #9775fa',
      color: '#9775fa'
    }
    return (
      <ul className="tab">
        {tabData.map((v, idx) =>
          <li key={idx} className={v.clsName} onClick={e => this.handleClick(e, v.en_name)}>
            <NavLink to={v.to} activeStyle={v.activeStyle ? activeStyle : null}>{v.name}</NavLink>
          </li>)}
        {/* <li className="index"><NavLink to="/israel/1" activeStyle={activeStyle}>이스라엘군</NavLink></li>
        <li className="index" onClick={this.handleClick}><NavLink to="/arab" >아랍군</NavLink></li>
        <li className="index"><NavLink to="/turkey">연해주&터키군</NavLink></li>
        <li className="index"><NavLink to="/youth_man">청년예베(남)</NavLink></li>
        <li className="index"><NavLink to="/posts" activeStyle={activeStyle}>청년예베(여)</NavLink></li> */}
      </ul>
    )
  }
}

const mapStateToProps = (state) => ({
  number: state.number,
  idx: state.idx
});

const mapDispatchToProps = dispatch => ({
  increment: () => dispatch(increment()),
  indexing: idx => dispatch(indexing(idx))
})

export default connect(mapStateToProps, mapDispatchToProps)(Tab);