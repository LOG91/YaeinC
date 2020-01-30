import React, { PureComponent } from 'react';
import './CellTable.scss';
import { indexing, changeCurrentInfo, checkWorship, checkMemberWorship, countContent, sheets, changeLeaderName, changeMemberName, removeLeader, removeMember, modalOpend } from '../../store/modules/checker';
import { connect } from 'react-redux';

import renderCellList from './CellListTable'
import FortalModal from '../Modal/FortalModal';
import Modal from '../Modal/Modal';
import AddForm from '../AddForm/AddForm';

class CellTable extends PureComponent {

  handleCheck = (id, sectionIdx, kind) => {
    fetch(`/api/check/leader/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, kind })
    }).then(responsedData => {
      if (responsedData.status === 200) {
        this.props.checkWorship(id, sectionIdx, kind);
      }
    });
  };

  handleModifyName = ({ id, sectionIdx, leaderIdx, target, memberIdx }) => {
    const { currentSection } = this.props;
    const changedName = typeof memberIdx !== 'undefined' ?
      currentSection[sectionIdx][leaderIdx].members[memberIdx].name :
      currentSection[sectionIdx][leaderIdx].name;
    fetch(`/api/change/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ changedName })
    });
    target.classList.remove('active');
  };

  handleChangeName = ({ sectionIdx, leaderIdx, changedName, nextNode, memberIdx }) => {
    const { changeLeaderName, changeMemberName } = this.props;
    nextNode.classList.add('active');
    if (typeof memberIdx !== 'undefined') {
      changeMemberName(sectionIdx, leaderIdx, memberIdx, changedName)
    } else {
      changeLeaderName(sectionIdx, leaderIdx, changedName);
    }
  };

  handleRemoveMember = ({ id, sectionIdx, leaderIdx, memberIdx }) => {
    const { removeLeader, removeMember, changeCurrentInfo, modalOpend } = this.props;
    fetch(`/api/member/${id}`, {
      method: 'DELETE'
    }).then(res => res.json())
      .then(res => {
        if (res.ok) {
          changeCurrentInfo('currentModal', null);
          changeCurrentInfo('modalOpend', !modalOpend);
          typeof memberIdx === 'undefined' ? removeLeader(sectionIdx, leaderIdx) :
            removeMember(sectionIdx, leaderIdx, memberIdx);
        }
      });
  }

  handleCheckMember = async (leaderId, id, memberIdx, sectionIdx, kind) => {
    const responsedData = await fetch(`/api/check/leader/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, kind })
    });
    if (responsedData.status === 200) {
      this.props.checkMemberWorship(leaderId, id, memberIdx, sectionIdx, kind);
    }
  }

  handleCount = async (id, sectionIdx, kind, count) => {
    const responsedData = await fetch(`/api/count/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, kind, count: Number(count) })
    });
    if (responsedData.status === 200) {
      this.props.countContent(id, sectionIdx, kind, Number(count));
    }
  };

  handleAddLeader = ({ inner, leader, idx }) => {
    const { changeCurrentInfo, modalOpend } = this.props;
    changeCurrentInfo('currentModal', !modalOpend ? inner : null);
    changeCurrentInfo('modalOpend', !modalOpend)
  };

  handleAddNetwork = ({ inner }) => {
    const { changeCurrentInfo, modalOpend } = this.props;
    changeCurrentInfo('currentModal', !modalOpend ? inner : null);
    changeCurrentInfo('modalOpend', !modalOpend)
  }


  render() {
    const { isAdmin, currentSection, sheets } = this.props;
    return (
      <table className={isAdmin ? "print-area cell-table" : "cell-table"} border="1" cellPadding="10">
        <tbody>
          <tr>
            <th rowSpan="2" className="cell-table__th cell-table__th--section-name" onClick={() => this.re('israel')}>네트워크</th>
            <th rowSpan="2" className="cell-table__th cell-table__th--leader-name" onClick={this.onPrint}>리더</th>
            <th colSpan="5" className="cell-table__th cell-table__th--leader-check">리더 체크리스트</th>
            <th rowSpan="2" className="cell-table__th cell-table__th--member-name">셀원</th>
            <th colSpan="3" className="cell-table__th cell-table__th--member-check">셀원 체크리스트</th>
          </tr>
          <tr>
            <td className="cell-table__td">새벽</td>
            <td className="cell-table__td">말씀</td>
            <td className="cell-table__td">셀</td>
            <td className="cell-table__td">주일</td>
            <td className="cell-table__td">청년</td>
            <td className="cell-table__td">셀</td>
            <td className="cell-table__td">주일</td>
            <td className="cell-table__td">청년</td>
          </tr>
          {renderCellList({
            isAdmin,
            currentSection,
            handleCheck: this.handleCheck,
            handleCount: this.handleCount,
            handleCheckMember: this.handleCheckMember,
            handleAddLeader: this.handleAddLeader,
            handleModifyName: this.handleModifyName,
            handleChangeName: this.handleChangeName,
            handleRemoveMember: this.handleRemoveMember
          })}
        </tbody>
        {isAdmin ? (
          <div className="networkName-box">
            {sheets.length > 0 ?
              (<button
                className="btn btn-outline-dark networkName-box__button"
                onClick={() => this.handleAddNetwork({ inner: (<Modal onToggleModal={this.handleAddNetwork}><AddForm isAddNetwork={true} /></Modal>) })}>네트워크 추가</button>)
              : (<div>😰시트가 없습니다 시트를 먼저 추가하세요</div>)}
          </div>) : null}
      </table>
    )
  }
}


const mapStateToProps = (state) => {
  return ({
    members: state.checker.members,
    idx: state.checker.idx,
    currentSection: state.checker.currentSection,
    sheets: state.checker.sheets,
    modalOpend: state.checker.modalOpend
  })
};

const mapDispatchToProps = dispatch => ({
  indexing: idx => dispatch(indexing(idx)),
  checkWorship: (name, sectionIdx, left) => dispatch(checkWorship(name, sectionIdx, left)),
  checkMemberWorship: (leaderId, id, sec, sectionIdx, left) => dispatch(checkMemberWorship(leaderId, id, sec, sectionIdx, left)),
  countContent: (name, sectionIdx, left, count) => dispatch(countContent(name, sectionIdx, left, count)),
  changeCurrentInfo: (left, right) => dispatch(changeCurrentInfo(left, right)),
  changeLeaderName: (sectionIdx, leaderIdx, changedName) => dispatch(changeLeaderName(sectionIdx, leaderIdx, changedName)),
  changeMemberName: (sectionIdx, leaderIdx, memberIdx, changedName) => dispatch(changeMemberName(sectionIdx, leaderIdx, memberIdx, changedName)),
  removeLeader: (sectionIdx, leaderIdx) => dispatch(removeLeader(sectionIdx, leaderIdx)),
  removeMember: (sectionIdx, leaderIdx, memberIdx) => dispatch(removeMember(sectionIdx, leaderIdx, memberIdx)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CellTable);
