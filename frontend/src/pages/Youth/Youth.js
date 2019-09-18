import React from 'react';
import { connect } from 'react-redux';
import { indexing, chageCurrentSection, checkYouth, checkMemberYouth } from '../../store/modules/counter';
import Tab from '../../components/Tab/Tab';
import './Youth.scss';

class Youth extends React.Component {
  componentDidMount() {
    const { indexing, match: { path } } = this.props;
    indexing(path.slice(1));
    this.fetchInfo();
  }
  async fetchInfo() {
    const { chageCurrentSection } = this.props;
    const tempCells = ['israel_ga', 'israel_na', 'israel_da'];
    const info = await fetch(`/api/cells/${JSON.stringify(tempCells)}`).then(res => res.json()).then();
    chageCurrentSection(info);
  }

  handleYouthCheck = async ({ sectionIdx, leaderIdx, leaderId, youthId, date, memberIdx = null }) => {
    const { checkYouth, checkMemberYouth } = this.props;
    const temp = await fetch(`/api/youth/${youthId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: youthId, date })
    });
    if (temp.status === 200) {
      console.log(sectionIdx, leaderIdx, leaderId, date, memberIdx);
      memberIdx !== null ? checkMemberYouth({ sectionIdx, leaderIdx, memberIdx, date }) :
        checkYouth(sectionIdx, leaderIdx, leaderId, date);
    }
  }

  youthTableTpl = (arr, networks) => {
    console.log(networks);
    if (!networks.length) return;
    const checkList = (networks, sectionIdx) => networks.map((leader, leaderIdx) => {
      return (
        <div>
          <li className="youthContainer__navbar">
            <div className="youthContainer__nav--leader"><div>{leader.name}</div></div>
            {arr.map(date => {
              return (
                <div className="youthContainer__nav">
                  <div>
                    <input
                      className="checkbox"
                      checked={(leader.youth.att && leader.youth.att[date]) ? true : false}
                      readOnly
                      type="checkbox"
                      onClick={e =>
                        this.handleYouthCheck({
                          leaderId: leader._id,
                          sectionIdx,
                          leaderIdx,
                          youthId: leader.youth._id,
                          date
                        })}
                    />
                  </div>
                </div>
              )
            })}
          </li>
          {leader.members.map((member, memberIdx) => {
            return (
              <li className="youthContainer__navbar">
                <div className="youthContainer__nav"><div>{member.name}</div></div>
                {arr.map(date => {
                  return (
                    <div className="youthContainer__nav">
                      <div>
                        <input
                          className="checkbox"
                          checked={(member.youth.att && member.youth.att[date]) ? true : false}
                          readOnly
                          type="checkbox"
                          onClick={() => this.handleYouthCheck({
                            leaderId: leader._id,
                            sectionIdx,
                            leaderIdx,
                            youthId: member.youth._id,
                            date,
                            memberIdx
                          })}
                        />
                      </div>
                    </div>
                  )
                })}
              </li>
            )
          })}
        </div>
      )
    });

    const dd = (network, sectionIdx) =>
      (<div className="youthContainer--networkBox">
        <div className="youthContainer__flexbox">
          <div className="youthContainer--networkName"><p>{network[0].cellNameKr}</p></div>
          <div>
            {checkList(network, sectionIdx)}
          </div>
        </div>
      </div>);
    const mapped = networks.map((network, sectionIdx) => dd(network, sectionIdx));
    return mapped;
  }
  render() {
    const tempArr = ['7_10', '7_17', '7_24', '7_31', '8_7', '8_14', '8_21', '8_28', '9_4', '9_11', '9_18', '9_25'];
    const { currentSection } = this.props;
    return (
      <React.Fragment>
        <Tab />
        <div className="youthContainer">
          <div className="youthContainer__flexbox">
            <div className="youthContainer__nav--empty"><p></p></div>
            <div className="youthContainer__navbar">
              {tempArr.map(v => {
                const [month, day] = v.split('_');
                return <div className="youthContainer__nav--date"><div>{`${month}월 ${day}일`}</div></div>
              })}
            </div>
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
  chageCurrentSection: section => dispatch(chageCurrentSection(section)),
  indexing: idx => dispatch(indexing(idx)),
  checkYouth: (sectionIdx, leaderIdx, leaderId, date) => dispatch(checkYouth(sectionIdx, leaderIdx, leaderId, date)),
  checkMemberYouth: ({ sectionIdx, leaderIdx, memberIdx, date }) => dispatch(checkMemberYouth({ sectionIdx, leaderIdx, memberIdx, date }))
});

export default connect(mapStateToProps, mapDispatchToProps)(Youth);