import React, { useEffect, useState, useCallback, useRef } from 'react';
import './CellTable.scss';
import {
  changeCurrentInfo,
  checkWorship,
  checkMemberWorship,
  countContent,
  changeLeaderName,
  changeMemberName,
  removeLeader,
  removeMember,
  modalOpend
} from '../../store/modules/checker';
import { useSelector, useDispatch } from 'react-redux';

import CellList from './CellList';
import { Modal, ConfirmModal } from '../Modal';
import { AddNetworkForm } from '../AddForm';
import AddMemberForm from '../AddForm/AddMemberForm';

import Sortable from 'sortablejs';


const CellTable = ({ isAdmin }) => {
  const dispatch = useDispatch(null);
  const { currentSection, sheets, currentSheetInfo } = useSelector(state => state.checker);

  const cellWrapperRef = useRef(null);
  const [checker, setChecker] = useState(null);

  let sortableForNetwork = null;

  useEffect(() => {
    const cellWrapperEl = document.querySelector('.cell-wrapper');
    if (isAdmin && cellWrapperEl) {
      sortableForNetwork = new Sortable(cellWrapperEl,
        {
          sort: true,
          animation: 150,
          delay: 0,
          handle: ".network-wrapper__icon",
          onStart: () => {
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
                sheetId: currentSheetInfo._id
              })
            })
              .then(res => res.json())
              .then(() => {
                const filtered = idList.map(v => currentSection.find(item => item._id === v));
                dispatch(changeCurrentInfo('currentSection', filtered));
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
        dispatch(checkWorship(id, sectionIdx, kind));
      }
    });
  });

  const handleRemoveNetworkCell = ({ idx, id, cellName }) => {
    dispatch(changeCurrentInfo('currentModal',
      <Modal>
        <ConfirmModal confirmAction={() => {
          fetch(`/api/networkCell/${id}`, {
            method: 'DELETE'
          })
            .then(res => res.json())
            .then(() => {
              dispatch(changeCurrentInfo('currentModal', null));
              dispatch(changeCurrentInfo('modalOpend', false));
              dispatch(changeCurrentInfo('currentSection', [...currentSection.slice(0, idx), ...currentSection.slice(idx + 1, currentSection.length)]));
            });
        }} message={`셀 ${cellName}를 삭제하시겠습니까?`} />
      </Modal>
    ));
    dispatch(changeCurrentInfo('modalOpend', true));
  };

  const handleModifyName = ({ changedName, id }) => {
    fetch(`/api/change/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ changedName })
    });
  };


  const handleChangeName = ({ id, sectionIdx, leaderIdx, changedName, nextNode, memberIdx }) => {
    const changeMember = () => {
      if (typeof memberIdx !== 'undefined') {
        dispatch(changeMemberName(sectionIdx, leaderIdx, memberIdx, changedName));
      } else {
        dispatch(changeLeaderName(sectionIdx, leaderIdx, changedName));
      }
    };
    changeMember();
    if (checker) {
      clearTimeout(checker);
      setChecker(setTimeout(() => {
        handleModifyName({ changedName, id, sectionIdx, leaderIdx, memberIdx });
        setChecker(null);
      }, 1000));
    } else {
      setChecker(setTimeout(() => {
        handleModifyName({ changedName, id, sectionIdx, leaderIdx, memberIdx });
        setChecker(null);
      }, 1000));

    }
  };

  const handleRemoveMember = useCallback(({ id, sectionIdx, leaderIdx, memberIdx }) => {
    fetch(`/api/member/${id}`, {
      method: 'DELETE'
    }).then(res => res.json())
      .then(res => {
        if (res.ok) {
          dispatch(changeCurrentInfo('currentModal', null));
          dispatch(changeCurrentInfo('modalOpend', !modalOpend));
          typeof memberIdx === 'undefined' ? dispatch(removeLeader(sectionIdx, leaderIdx)) :
            dispatch(removeMember(sectionIdx, leaderIdx, memberIdx));
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
      dispatch(checkMemberWorship(leaderId, id, memberIdx, sectionIdx, kind));
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
      dispatch(countContent(id, sectionIdx, kind, Number(count)));
    }
  });

  const handleAddLeader = useCallback((leader) => {
    dispatch(changeCurrentInfo('currentModal',
      <Modal>
        <AddMemberForm
          isLeader={true}
          cellInfo={leader}
          confirmAction={addLeader}
        />
      </Modal>));
    dispatch(changeCurrentInfo('modalOpend', !modalOpend));

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
    dispatch(changeCurrentInfo('currentModal', !modalOpend ? inner : null));
    dispatch(changeCurrentInfo('modalOpend', !modalOpend));
  });

  const handleAddMember = useCallback((leader) => {
    dispatch(changeCurrentInfo('currentModal', <Modal><AddMemberForm cellInfo={leader} confirmAction={addMember} /></Modal>));
    dispatch(changeCurrentInfo('modalOpend', true));

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
          handleAddMember: handleAddMember,
          handleModifyName,
          handleRemoveNetworkCell
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


export default CellTable;