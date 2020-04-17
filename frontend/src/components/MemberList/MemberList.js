import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMinus, faSortDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import './MemberList.scss';
import { changeCurrentInfo } from '../../store/modules/checker';
import { useDispatch } from 'react-redux';

import { Modal, ConfirmModal } from '../Modal';
import { FilterDropDown } from '../DropDown';


const MemberList = (props) => {
  const dispatch = useDispatch();
  const [members, setMembers] = useState([]);
  const [ALL_MEMBERS, setALL_MEMBERS] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [allPagesCount, setAllPagesCount] = useState(0);
  const [viewPageCount, setViewPageCount] = useState(10);
  const [pageMinCount, setPageMinCount] = useState(10);
  const [pageMaxCount, setPageMaxCount] = useState(10);

  const [filteredAge, setFilteredAge] = useState('나이');
  const [filteredGender, setFilteredGender] = useState('성별');

  useEffect(() => {
    const idxQuery = new URLSearchParams(props.location.search).get('idx') || 1;
    setCurrentPageNumber(Number(idxQuery));
    fetch('/api/members')
      .then(res => res.json())
      .then(members => {
        setMembers(members);
        setALL_MEMBERS(members);
        setAllPagesCount(Math.ceil(members.length / viewPageCount));
      });
  }, []);

  useEffect(() => {
    setPageMaxCount(currentPageNumber * viewPageCount);
    setPageMinCount(viewPageCount * currentPageNumber - viewPageCount + 1);
  }, [currentPageNumber]);

  const changeCurrentPageNumber = ({ targetNumber, callback, reverse = false }) => e => {
    e.preventDefault();
    if (reverse && (targetNumber === 1)) return;
    if (!reverse && targetNumber === allPagesCount) return;
    callback();
  };

  const onRemoveMember = ({ id, name }) => {
    dispatch(changeCurrentInfo('modalOpend', true));
    dispatch(changeCurrentInfo('currentModal',
      (
        <Modal>
          <ConfirmModal
            message={`정말 ${name} 님을 삭제하시겠습니까?`}
            confirmAction={() => {
              fetch(`/api/member/${id}`, {
                method: 'DELETE'
              }).then(res => res.json()).then(res => {
                if (res.ok) {
                  dispatch(changeCurrentInfo('modalOpend', null));
                  dispatch(changeCurrentInfo('currentModal', null));
                }
              });
            }} />
        </Modal>))
    );
  };

  const PagiNation = ({ allPagesCount, currentPageNumber }) => {
    return (
      <nav aria-label="...">
        <ul className="pagination">
          <li className={`page-item ${currentPageNumber === 1 && "disabled"}`}>
            <Link
              to={`/admin/members/?idx=${currentPageNumber === 1 ? 1 : (currentPageNumber - 1)}`}
              onClick={changeCurrentPageNumber({ reverse: true, targetNumber: currentPageNumber, callback: () => setCurrentPageNumber(currentPageNumber - 1) })} >
              <a className="page-link" tabIndex="-1" aria-disabled="true">Previous</a>
            </Link>
          </li>
          {Array(allPagesCount).fill(0).map((v, i) => {
            return (
              <li onClick={e => setCurrentPageNumber(i + 1)} key={i} className={`page-item ${currentPageNumber === (i + 1) && 'active'}`}>
                <Link to={`/admin/members/?idx=${i + 1}`} className="page-link"><a>{i + 1}</a></Link>
              </li>
            );
          })}
          <li className={`page-item ${currentPageNumber === allPagesCount && "disabled"}`}>
            <Link
              to={`/admin/members/?idx=${currentPageNumber + 1}`}
              onClick={changeCurrentPageNumber({ targetNumber: currentPageNumber, callback: () => setCurrentPageNumber(currentPageNumber + 1) })}>
              <a className="page-link" href="#">Next</a>
            </Link>
          </li>
        </ul>
      </nav>
    );
  };

  const changeMemberData = ({ idx }) => (evt) => {
    const left = evt.target.name;
    const right = evt.target.value;
    console.log(left, right, idx);
    const newMembers = [
      ...members.slice(0, idx),
      { ...members[idx], [left]: right },
      ...members.slice(idx + 1, members.length)
    ];
    setMembers(newMembers);
  };

  const filterByAge = ({ rating, currentValue }) => {
    setFilteredAge(currentValue === '전체' ? '나이' : `나이 : ${currentValue}`);
    let filteredMemberData = null;
    if (!rating) {
      setMembers(ALL_MEMBERS);
      setAllPagesCount(Math.ceil(ALL_MEMBERS.length / viewPageCount));
      return;
    }
    if (!rating[1]) {
      filteredMemberData = ALL_MEMBERS.filter(v => v.age >= rating[0]);
      setMembers(filteredMemberData);
      setAllPagesCount(Math.ceil(filteredMemberData.length / viewPageCount));
      return;
    }
    filteredMemberData = ALL_MEMBERS.filter(v => v.age >= rating[0] && v.age <= rating[1]);
    setMembers(filteredMemberData);
    setAllPagesCount(Math.ceil(filteredMemberData.length / viewPageCount));
  };

  const filterByGender = ({ rating, currentValue }) => {
    setFilteredGender(currentValue === '전체' ? '성별' : currentValue);
    if (!rating) {
      setMembers(ALL_MEMBERS);
      setAllPagesCount(Math.ceil(ALL_MEMBERS.length / viewPageCount));
      return;
    }
    const filteredMemberData = ALL_MEMBERS.filter(v => v.gender === rating);
    setMembers(filteredMemberData);
    setAllPagesCount(Math.ceil(filteredMemberData.length / viewPageCount));
  };

  const initFiltering = () => {
    filterByAge({ rating: null, currentValue: '전체' });
    filterByGender({ rating: null, currentValue: '전체' });
  };



  const renderMemberColumn = (member, idx) => {
    return (
      <>
        <div className="row members-container__row">
          <div className="col members-container__col">{pageMinCount + idx}</div>
          <div className="col members-container__col">
            <input className="members-container__input" name="name" value={member.name} onChange={changeMemberData({ idx })} />
          </div>
          <div className="col members-container__col">{member.age}</div>
          <div className="col members-container__col">
            {member.gender === 'male' ? '남' : '여'}
          </div>
          <div className="col members-container__col">{member.attached}</div>
          <div className="col members-container__col">{member.section}</div>
          <div className="col members-container__col">{member.cellNameKr}</div>
          <div className="col members-container__col">{member.isLeader ? 'O' : null}</div>
          <div className="col members-container__col">{member.isNetworkLeader ? 'O' : null}</div>
          <div className="col members-container__col">
            <FontAwesomeIcon
              icon={faUserMinus}
              onClick={() => onRemoveMember({ id: member._id, name: member.name })} />
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <h3 className="title"><Link to="/admin/members">멤버관리</Link></h3>
      <ul className="filter-box">
        <li className="filter-box__item">
          <FilterDropDown
            rating={[null, [20, 25], [26, 30], [31, 35], [36, null]]}
            list={['전체', '20 - 25', '26 - 30', '31 - 35', '36 -']}
            initialValue={filteredAge}
            handler={filterByAge} />
        </li>
        <li className="filter-box__item">
          <FilterDropDown
            rating={[null, 'male', 'female']}
            list={['전체', '형제', '자매']}
            initialValue={filteredGender}
            handler={filterByGender} />
        </li>
        <li className="filter-box__item">
          <a className="filter-box__deletion" onClick={initFiltering}>
            <div>필터 제거</div>
            <FontAwesomeIcon icon={faTimes} className="filter-box__svg" />
          </a>
        </li>
      </ul>
      <div className="container members-container">
        <div className="row">
          <div className="col">번호</div>
          <div className="col"><div>이름</div></div>
          <div className="col">
            <div>나이</div>
          </div>
          <div className="col">성별</div>
          <div className="col">소속</div>
          <div className="col">지역군</div>
          <div className="col">셀이름</div>
          <div className="col">리더</div>
          <div className="col">네트워크리더</div>
          <div className="col">삭제</div>
        </div>
        <div className="members-container__wrap">
          {members.length ? members.slice(pageMinCount - 1, pageMaxCount).map((member, idx) => renderMemberColumn(member, idx)) : null}
        </div>
        <div className="pagination-container">
          {PagiNation({ allPagesCount, currentPageNumber })}
        </div>
      </div>
    </>
  );
};


export default MemberList;