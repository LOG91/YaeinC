import React, { useEffect, useState, useCallback, useRef } from 'react';
import './CellTable.scss';
import { changeCurrentInfo, checkWorship, checkMemberWorship, countContent, sheets, changeLeaderName, changeMemberName, removeLeader, removeMember, modalOpend } from '../../store/modules/checker';
// import {} from '../../store/modules/inserted';
import { connect, useSelector, useDispatch } from 'react-redux';

import CellList from './CellList';
import Modal from '../Modal/Modal';
import { AddNetworkForm } from '../AddForm';
import AddMemberForm from '../AddForm/AddMemberForm';

import Sortable from 'sortablejs';


const CellTable = (props) => {
  const { isAdmin, current, changeCurrentInfo } = props;
  const dispatch = useDispatch(null);
  const currentSection = useSelector(state => state.checker.currentSection);
  const sheets = useSelector(state => state.checker.sheets);
  const currentSheetId = useSelector(state => state.checker.currentSheetId);
  const cellWrapperRef = useRef(null);

  const isNameEmpty = useSelector(state => state.inserted.isNameEmpty);

  let sortableForNetwork = null;

  useEffect(() => {
    const cellWrapperEl = document.querySelector('.cell-wrapper');
    if (isAdmin && cellWrapperEl) {
      console.log(currentSection);
      sortableForNetwork = new Sortable(cellWrapperEl,
        {
          sort: true,
          animation: 150,
          delay: 0,
          handle: ".network-wrapper__icon",
          onStart: (evt) => {
            cellWrapperRef.current.classList.add('sortabling');
          },
          onEnd: (evt) => {
            cellWrapperRef.current.classList.remove('sortabling');
            const { target: { children } } = evt;
            const idList = [...children].map(node => node.dataset.id);

            fetch('/api/networkCell/seq', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                seq: JSON.stringify(idList),
                sheetId: currentSheetId
              })
            })
              .then(res => res.json())
              .then(() => {
                const filtered = idList.map(v => currentSection.find(item => item._id === v));
                changeCurrentInfo('currentSection', filtered);
              });
          }
        });
    }

    return () => {
      isAdmin && sortableForNetwork.destroy();
    };
  }, [currentSection]);


  const handleCheck = useCallback((id, sectionIdx, kind) => {
    fetch(`/api/check/leader/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, kind })
    }).then(responsedData => {
      if (responsedData.status === 200) {
        props.checkWorship(id, sectionIdx, kind);
      }
    });
  });



  const handleChangeName = useCallback(({ sectionIdx, leaderIdx, changedName, nextNode, memberIdx }) => {
    const { changeLeaderName, changeMemberName } = props;
    nextNode.classList.add('active');
    if (typeof memberIdx !== 'undefined') {
      changeMemberName(sectionIdx, leaderIdx, memberIdx, changedName)
    } else {
      changeLeaderName(sectionIdx, leaderIdx, changedName);
    }
  });

  const handleRemoveMember = useCallback(({ id, sectionIdx, leaderIdx, memberIdx }) => {
    const { removeLeader, removeMember, changeCurrentInfo } = props;
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
  });

  const handleCheckMember = useCallback(async (leaderId, id, memberIdx, sectionIdx, kind) => {
    const responsedData = await fetch(`/api/check/leader/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, kind })
    });
    if (responsedData.status === 200) {
      props.checkMemberWorship(leaderId, id, memberIdx, sectionIdx, kind);
    }
  });

  const handleCount = useCallback((id, sectionIdx, kind, count) => async evt => {
    const responsedData = await fetch(`/api/count/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, kind, count: Number(count) })
    });
    if (responsedData.status === 200) {
      props.countContent(id, sectionIdx, kind, Number(count));
    }
  });

  const handleAddLeader = useCallback((leader) => {
    const { changeCurrentInfo } = props;

    changeCurrentInfo('currentModal',
      <Modal>
        <AddMemberForm
          isLeader={true}
          cellInfo={leader}
          confirmAction={addLeader}
        />
      </Modal>);
    changeCurrentInfo('modalOpend', !modalOpend);

    function addLeader({ insertedMember }) {
      if (insertedMember.name === '') {
        dispatch({ type: 'GO_EMPTY', target: 'name' });
        return;
      }
      if (insertedMember.age === '') {
        dispatch({ type: 'GO_EMPTY', target: 'age' });
        return;
      }
      fetch('/api/leader', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...insertedMember, cellId: leader.cellId }),
      }).then(res => {
        // onToggleModal({});
        return res.json();
      }).then(async leader => {
        window.location.href = window.location.href;
      });
    }

  });

  const handleAddNetwork = useCallback(({ inner }) => {
    const { changeCurrentInfo } = props;
    changeCurrentInfo('currentModal', !modalOpend ? inner : null);
    changeCurrentInfo('modalOpend', !modalOpend);
  });

  const handleAddMember = useCallback((leader) => {
    const { changeCurrentInfo } = props;
    changeCurrentInfo('currentModal', <Modal><AddMemberForm cellInfo={leader} confirmAction={addMember} /></Modal>)
    changeCurrentInfo('modalOpend', true);

    function addMember({ insertedMember }) {
      fetch('/api/member', {
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
  });


  return (
    <div className={isAdmin ? "print-area cell-container" : "cell-container"} border="1" cellPadding="10">
      <div className="cell-header">
        <ul className="cell-header__list">
          <li className="cell-header__item">
            <div className="cell-header__position">네트워크</div>
          </li>
          <li className="cell-header__item">
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
      <div className="cell-wrapper" ref={cellWrapperRef}>
        <CellList customProps={{
          isAdmin,
          handleCheck: handleCheck,
          handleCount: handleCount,
          handleCheckMember: handleCheckMember,
          handleAddLeader: handleAddLeader,
          handleChangeName: handleChangeName,
          handleRemoveMember: handleRemoveMember,
          handleAddMember: handleAddMember
        }} />
      </div>
      {isAdmin ? (
        <div className="networkName-box">
          {sheets.length > 0 ?
            (<button
              className="btn btn-outline-dark networkName-box__button"
              onClick={() => handleAddNetwork({ inner: (<Modal onToggleModal={handleAddNetwork}><AddNetworkForm isAddNetwork={true} /></Modal>) })}>네트워크 추가</button>)
            : (<div>😰시트가 없습니다 시트를 먼저 추가하세요</div>)}
        </div>) : null}
    </div>
  );

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

export default connect(null, mapDispatchToProps)(CellTable);
