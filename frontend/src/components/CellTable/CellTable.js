import React, { PureComponent } from 'react';
import './CellTable.scss';
import { changeCurrentInfo, checkWorship, checkMemberWorship, countContent, sheets, changeLeaderName, changeMemberName, removeLeader, removeMember, modalOpend } from '../../store/modules/checker';
import { connect } from 'react-redux';

import renderCellList from './CellListTable';
import Modal from '../Modal/Modal';
import AddForm from '../AddForm/AddForm';
import AddMemberForm from '../AddForm/AddMemberForm';

import Sortable from 'sortablejs';


class CellTable extends PureComponent {
  constructor(props) {
    super(props);
    this.sortableForNetwork = null;
    this.sortableForLeader = null;
  }
  componentDidUpdate() {
    const cellWrapperEl = document.querySelector('.cell-wrapper');
    const leaderListEl = document.querySelector('.network-wrapper__flex--column');
    if (!cellWrapperEl) return;
    if (!leaderListEl) return;
    if (this.sortableForNetwork !== null) this.sortableForNetwork.destroy();
    if (this.sortableForLeader !== null) this.sortableForLeader.destroy();
    this.sortableForNetwork = new Sortable(cellWrapperEl,
      {
        sort: true,
        animation: 150,
        delay: 0,
        handle: ".network-wrapper__icon"
      });

    this.sortableForLeader = new Sortable(leaderListEl,
      {
        sort: true,
        animation: 150,
        delay: 0,
        handle: ".member-container__button.fa-bars",
        onEnd: (evt) => {
          const { target: { children } } = evt;
          const idList = [...children].map(node => node.dataset.id);
          fetch('/api/leader/seq', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              seq: JSON.stringify(idList)
            })
          }).then(res => res.json())
            .then(res => {
              console.log(res);
            });
        }
      });
    return true;
  }

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

  handleAddMember = (leader) => {
    console.log(leader);
    const { changeCurrentInfo } = this.props;
    changeCurrentInfo('currentModal', <Modal><AddMemberForm cellInfo={leader} confirmAction={addNetworkCell} /></Modal>)
    changeCurrentInfo('modalOpend', true)
    // console.log(insertedMember)

    async function addNetworkCell({ insertedMember }) {
      await fetch('/api/member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(insertedMember),
      }).then(res => {
        // onToggleModal({});
        return res.json();
      }).then(async leader => {
        window.location.href = window.location.href;
      });
    }
  }


  render() {
    const { isAdmin, currentSection, sheets, current } = this.props;
    console.log(current, '커런트');
    return (
      <div className={isAdmin ? "print-area cell-container" : "cell-container"} border="1" cellPadding="10">
        <div className="cell-header">
          <ul className="cell-header__list">
            <li className="cell-header__item" rowSpan="2" onClick={() => this.re('israel')}>
              <div className="cell-header__position">네트워크</div>
            </li>
            <li className="cell-header__item" rowSpan="2" onClick={this.onPrint}>
              <div className="cell-header__position">리더</div>
            </li>
            <li>
              <div className="leader-check">리더 체크리스트</div>
              <div className="leader-check">
                <ul className="leader-check__list">
                  <li className="leader-check__item">새벽</li>
                  <li className="leader-check__item">말씀</li>
                  <li className="leader-check__item">셀</li>
                  <li className="leader-check__item">주일</li>
                  <li className="leader-check__item">청년</li>
                </ul>
              </div>
            </li>
            <li className="cell-header__item">
              <div className="cell-header__position">셀원</div>
            </li>
            <li className="cell-header__item">
              <div className="member-check">셀원 체크리스트</div>
              <div className="member-check">
                <ul className="member-check__list">
                  <li className="member-check__item">셀</li>
                  <li className="member-check__item">주일</li>
                  <li className="member-check__item">청년</li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="cell-wrapper">
          {renderCellList({
            isAdmin,
            currentSection,
            handleCheck: this.handleCheck,
            handleCount: this.handleCount,
            handleCheckMember: this.handleCheckMember,
            handleAddLeader: this.handleAddLeader,
            handleModifyName: this.handleModifyName,
            handleChangeName: this.handleChangeName,
            handleRemoveMember: this.handleRemoveMember,
            handleAddMember: this.handleAddMember
          })}
        </div>
        {isAdmin ? (
          <div className="networkName-box">
            {sheets.length > 0 ?
              (<button
                className="btn btn-outline-dark networkName-box__button"
                onClick={() => this.handleAddNetwork({ inner: (<Modal onToggleModal={this.handleAddNetwork}><AddForm isAddNetwork={true} /></Modal>) })}>네트워크 추가</button>)
              : (<div>😰시트가 없습니다 시트를 먼저 추가하세요</div>)}
          </div>) : null}
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return ({
    members: state.checker.members,
    currentSection: state.checker.currentSection,
    sheets: state.checker.sheets,
    modalOpend: state.checker.modalOpend,
    attached: state.checker.attached
  })
};

const mapDispatchToProps = dispatch => ({
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
