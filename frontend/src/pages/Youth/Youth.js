import React from 'react';
import { connect } from 'react-redux';
import { indexing, changeCurrentSection, checkYouth, checkMemberYouth } from '../../store/modules/checker';
import Tab from '../../components/Tab/Tab';
import './Youth.scss';

class Youth extends React.Component {
  componentDidMount() {
    const { indexing, match: { path } } = this.props;
    indexing(path.slice(1));
    this.fetchInfo();
  }
  async fetchInfo() {
    const { changeCurrentSection } = this.props;
    const tempCells = ['israel_ga', 'israel_na', 'israel_da'];
    const info = await fetch(`/api/cells/${JSON.stringify(tempCells)}`).then(res => res.json()).then();
    changeCurrentSection(info);
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
    <div class="table-wrapper">
      <table id="consumption-data" class="data">
        <thead class="header">
          <tr>
            {/* <th>네트워크</th> */}
            <th>이름</th>
            {arr.map(v => {
              const [month, day] = v.split('_');
              return <th>{`${month}월 ${day}일`}</th>
            })}
          </tr>
        </thead>
        <tbody class="results">
          <tr>
            <th>Jan</th>
            <td>3163</td>
            <td>3163</td>
            <td>3163</td>
            <td>3163</td>
          </tr>
          <tr>
            <th>Feb</th>
            <td>3163</td>
            <td>3163</td>
            <td>3163</td>
            <td>3163</td>
          </tr>
          <tr>
            <th>Mar</th>
            <td>3163</td>
            <td>3163</td>
            <td>3163</td>
            <td>3163</td>
          </tr>
          <tr>
            <th>Apr</th>
            <td>3163</td>
            <td>3163</td>
            <td>3163</td>
            <td>3163</td>
          </tr>
          <tr>
            <th>May</th>
            <td>3163</td>
            <td>3163</td>
            <td>3163</td>
            <td>3163</td>
          </tr>
          <tr>
            <th>Jun</th>
            <td>3163</td>
            <td>3163</td>
            <td>3163</td>
            <td>3163</td>
          </tr>
          <tr>
            <th>Jun</th>
            <td>3163</td>
            <td>3163</td>
            <td>3163</td>
            <td>3163</td>
          </tr>
          <tr>
            <th>Jun</th>
            <td>3163</td>
            <td>3163</td>
            <td>3163</td>
            <td>3163</td>
          </tr>
          <tr>
            <th>Jun</th>
            <td>3163</td>
            <td>3163</td>
            <td>3163</td>
            <td>3163</td>
          </tr>

          <tr>
            <th>...</th>
            <td>...</td>
            <td>...</td>
            <td>...</td>
            <td>...</td>
          </tr>
        </tbody>
      </table>
    </div>
    const checkList = (networks, sectionIdx) => networks.map((leader, leaderIdx) => {
      return (
        <React.Fragment>
          <tr>
            <td>{leader.name}</td>
            {arr.map(date => {
              return (
                <td>
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
                </td>
              )
            })}
          </tr>
          {leader.members.map((member, memberIdx) => {
            return (
              <tr>
                <td>{member.name}</td>
                {arr.map(date => {
                  return (
                    <td>
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
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </React.Fragment>
      )
    });

    const dd = (network, sectionIdx) => {
      const allMembersLength = network.reduce((acc, cv) => {
        return acc += 1 + cv.members.length;
      }, 0) + 1;
      return (<React.Fragment>
        {/* <tr>
          <td rowSpan={allMembersLength} className="youthContainer--networkName">{network[0].cellNameKr}</td>
        </tr> */}
        {checkList(network, sectionIdx)}
      </React.Fragment>);
      // return (<div className="youthContainer--networkBox">
      //   <div className="youthContainer__flexbox">
      //     <div className="youthContainer--networkName"><p>{network[0].cellNameKr}</p></div>
      //     <div>
      //       {checkList(network, sectionIdx)}
      //     </div>
      //   </div>
      // </div>);
    }

    const mapped = (
      <div class="table-wrapper">
        <table id="consumption-data" class="data">
          <thead class="header">
            <tr>
              {/* <th>네트워크</th> */}
              <th>이름</th>
              {arr.map(v => {
                const [month, day] = v.split('_');
                return <th>{`${month}월 ${day}일`}</th>
              })}
            </tr>
          </thead>
          <tbody class="results">
            {networks.map((network, sectionIdx) => dd(network, sectionIdx))}
          </tbody>
        </table>
      </div>
    )
    return mapped;
  }
  render() {
    const tempArr = ['7_10', '7_17', '7_24', '7_31', '8_7', '8_14', '8_21', '8_28', '9_4', '9_11', '9_18', '9_25'];
    const { currentSection, match: { path } } = this.props;
    return (
      <React.Fragment>
        <Tab isAdmin={path.match(/admin/g)} />
        {/* <div className="youthContainer">
          <div className="youthContainer__scrollbox">
          <div className="youthContainer__flexbox">
            <div className="youthContainer__nav--empty"><p></p></div>
            <div className="youthContainer__navbar">
              {tempArr.map(v => {
                const [month, day] = v.split('_');
                return <div className="youthContainer__nav--date"><div>{`${month}월 ${day}일`}</div></div>
              })}
            </div>
          </div> */}
        {this.youthTableTpl(tempArr, currentSection)}
        {/* </div>
        </div> */}
      </React.Fragment>
    );
  }
};

const mapStateToProps = (state) => ({
  currentSection: state.checker.currentSection
});

const mapDispatchToProps = dispatch => ({
  changeCurrentSection: section => dispatch(changeCurrentSection(section)),
  indexing: idx => dispatch(indexing(idx)),
  checkYouth: (sectionIdx, leaderIdx, leaderId, date) => dispatch(checkYouth(sectionIdx, leaderIdx, leaderId, date)),
  checkMemberYouth: ({ sectionIdx, leaderIdx, memberIdx, date }) => dispatch(checkMemberYouth({ sectionIdx, leaderIdx, memberIdx, date }))
});

export default connect(mapStateToProps, mapDispatchToProps)(Youth);