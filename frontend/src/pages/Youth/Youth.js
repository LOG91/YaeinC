import React from 'react';
import { connect } from 'react-redux';
import { checkYouth, checkMemberYouth, attached, changeCurrentInfo } from '../../store/modules/checker';
import Tab from '../../components/Tab/Tab';
import './Youth.scss';

class Youth extends React.Component {
  componentDidMount() {
    const { match: { path } } = this.props;
    this.fetchInfo();
  }

  async fetchInfo() {
    const { changeCurrentInfo, match: { params: { attached } } } = this.props;
    const tempCells = ['이스라엘(가)', '연해주', '안디옥'];
    const info = await fetch(`http://localhost:7000/api/cells/${JSON.stringify(tempCells)}`).then(res => res.json()).then();
    const tt = await fetch('http://localhost:7000/api/gender/male').then(res => res.json()).then();
    changeCurrentInfo('attached', attached);
    changeCurrentInfo('currentSection', info);
    console.log(tt);
  }

  handleYouthCheck = async ({ sectionIdx, leaderIdx, leaderId, youthId, date, memberIdx = null }) => {
    const { checkYouth, checkMemberYouth } = this.props;
    const temp = await fetch(`http://localhost:7000/api/youth/${youthId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: youthId, date })
    });
    if (temp.status === 200) {
      memberIdx !== null ? checkMemberYouth({ sectionIdx, leaderIdx, memberIdx, date }) :
        checkYouth(sectionIdx, leaderIdx, leaderId, date);
    }
  }

  youthTableTpl = (arr, networks) => {
    if (!networks.length) return;
    const checkList = (networks, sectionIdx) => networks.map((leader, leaderIdx) => {
      return (
        <React.Fragment key={leader + leaderIdx}>
          <tr>
            <td>{leader.name}</td>
            {arr.map(date => {
              return (
                <td key={date}>
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={(leader.youth.att && leader.youth.att[date]) ? true : false}
                    readOnly />
                  <label className="check" onClick={e =>
                    this.handleYouthCheck({
                      leaderId: leader._id,
                      sectionIdx,
                      leaderIdx,
                      youthId: leader.youth._id,
                      date
                    })}>
                    <svg width="18px" height="18px" viewBox="0 0 18 18">
                      <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                      <polyline points="1 9 7 14 15 4"></polyline>
                    </svg>
                  </label>
                </td>
              )
            })}
          </tr>
          {leader.members.map((member, memberIdx) => {
            return (
              <tr key={member + memberIdx}>
                <td>{member.name}</td>
                {arr.map(date => {
                  return (
                    <td key={date}>
                      <input
                        type="checkbox"
                        className="custom-checkbox"
                        checked={(member.youth.att && member.youth.att[date]) ? true : false}
                        readOnly />
                      <label className="check"
                        onClick={() => this.handleYouthCheck({
                          leaderId: leader._id,
                          sectionIdx,
                          leaderIdx,
                          youthId: member.youth._id,
                          date,
                          memberIdx
                        })}>
                        <svg width="18px" height="18px" viewBox="0 0 18 18">
                          <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                          <polyline points="1 9 7 14 15 4"></polyline>
                        </svg>
                      </label>
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
      return (<React.Fragment key={network + sectionIdx}>
        <tr>
          <td rowSpan={allMembersLength} className="youthContainer--networkName">{network[0].cellNameKr}</td>
        </tr>
        {checkList(network, sectionIdx)}
      </React.Fragment>);
    }

    const mapped = (
      <div className="table-wrapper youthContainer">
        <table id="consumption-data" className="data">
          <thead className="header">
            <tr>
              <th>이름</th>
              {arr.map(v => {
                const [month, day] = v.split('_');
                return <th key={`${month}/${day}`}>{`${month}/${day}`}</th>
              })}
            </tr>
          </thead>
          <tbody className="results">
            {networks.map((network, sectionIdx) => dd(network, sectionIdx))}
          </tbody>
        </table>
      </div>
    )
    return mapped;
  }
  render() {
    const tempArr = ['7_10', '7_17', '7_24', '7_31', '8_7', '8_14', '8_21', '8_28', '9_4', '9_11', '9_18', '9_25'];
    const { currentSection, attached, match: { path } } = this.props;
    const idx = path.slice(1);
    console.log(attached);
    return (
      <React.Fragment>
        <Tab idx={idx} attached={attached} isAdmin={path.match(/admin/g)} />
        {this.youthTableTpl(tempArr, currentSection)}
      </React.Fragment>
    );
  }
};

const mapStateToProps = (state) => ({
  currentSection: state.checker.currentSection,
  attached: state.checker.attached
});

const mapDispatchToProps = dispatch => ({
  changeCurrentInfo: (left, right) => dispatch(changeCurrentInfo(left, right)),
  checkYouth: (sectionIdx, leaderIdx, leaderId, date) => dispatch(checkYouth(sectionIdx, leaderIdx, leaderId, date)),
  checkMemberYouth: ({ sectionIdx, leaderIdx, memberIdx, date }) => dispatch(checkMemberYouth({ sectionIdx, leaderIdx, memberIdx, date }))
});

export default connect(mapStateToProps, mapDispatchToProps)(Youth);