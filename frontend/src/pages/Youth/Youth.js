import React from 'react';
import { connect } from 'react-redux';
import { chageCurrentSection } from '../../store/modules/counter';
import './Youth.scss';

class Youth extends React.Component {
  componentDidMount() {
    console.log('did0');
    this.fetchInfo();
  }
  async fetchInfo() {
    console.log('fetch')
    const { chageCurrentSection } = this.props;
    const tempCells = ['israel_ga', 'israel_na', 'israel_da'];
    const info = await fetch(`/api/cells/${JSON.stringify(tempCells)}`).then(res => res.json()).then();
    console.log(info, 'infofo');
    chageCurrentSection(info);

  }

  youthTableTpl = (arr, networks) => {
    if (!networks.length) return;
    const checkList = (networks) => networks.map(leader => {
      return (
        <div>
          <li className="youthContainer__navbar">
            <div className="youthContainer__nav--leader"><p>{leader.name}</p></div>
            {arr.map(v => {
              return (
                <div className="youthContainer__nav">
                  <input className="styled-checkbox" checked={(leader.youth.att && leader.youth.att[v]) ? true : false} readOnly type="checkbox" />
                  <label />
                </div>
              )
            })}
          </li>
          {leader.members.map(member => {
            return (
              <li className="youthContainer__navbar">
                <div className="youthContainer__nav"><p>{member.name}</p></div>
                {arr.map(v => {
                  return (
                    <div className="youthContainer__nav">
                      <input className="styled-checkbox" checked={(member.youth.att && member.youth.att[v]) ? true : false} readOnly type="checkbox" />
                      <label />
                    </div>
                  )
                })}
              </li>
            )
          })}
        </div>
      )
    });

    const dd = (network) =>
      (<div className="container">
        <div className="youthContainer__flexbox">
          <div><p>{network[0].cellNameKr}</p></div>
          <div>
            {checkList(network)}
          </div>
        </div>
      </div>);
    const mapped = networks.map(network => dd(network));
    return mapped;
  }
  render() {
    const tempArr = ['7_10', '7_17', '7_24', '7_31', '8_7', '8_14', '8_21', '8_28', '9_4', '9_11', '9_18', '9_25'];
    const { currentSection } = this.props;
    return (
      <React.Fragment>
        <div className="youthContainer">
          <div className="youthContainer__navbar">
            <div className="youthContainer__nav">이름</div>
            {tempArr.map(v => (
              <div className="youthContainer__nav">{v}</div>
            ))}
          </div>
          <div className="youthContainer__scrollbox">
            {this.youthTableTpl(tempArr, currentSection)}
          </div>
        </div>
      </React.Fragment>
    );
  }
};

const mapStateToProps = (state) => ({
  currentSection: state.currentSection
});

const mapDispatchToProps = dispatch => ({
  chageCurrentSection: section => dispatch(chageCurrentSection(section))
});

export default connect(mapStateToProps, mapDispatchToProps)(Youth);