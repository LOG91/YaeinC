import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './MemberList.scss';

const MemberList = (props) => {
  console.log(props);
  const [members, setMembers] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [allPagesCount, setAllPagesCount] = useState(0);
  const [viewPageCount, setViewPageCount] = useState(10);
  const [pageMinCount, setPageMinCount] = useState(10);
  const [pageMaxCount, setPageMaxCount] = useState(10);

  useEffect(() => {
    const idxQuery = new URLSearchParams(props.location.search).get('idx') || 1;
    setCurrentPageNumber(Number(idxQuery));
    fetch('/api/members')
      .then(res => res.json())
      .then(members => {
        setMembers(members);
        setAllPagesCount(Math.ceil(members.length / viewPageCount));
      });
  }, []);

  useEffect(() => {
    setPageMaxCount(currentPageNumber * viewPageCount);
    setPageMinCount(viewPageCount * currentPageNumber - viewPageCount + 1);
  }, [currentPageNumber]);

  const changeCurrentPageNumber = ({ targetNumber, callback, reverse = false }) => e => {
    console.log(e, targetNumber, callback);
    e.preventDefault();
    if (reverse && (targetNumber === 1)) return;
    if (!reverse && targetNumber === allPagesCount) return;
    callback();
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

  const renderMemberColumn = (member, idx) => {
    return (
      <>
        <div className="row members-container__row">
          <div className="col members-container__col">{pageMinCount + idx}</div>
          <div className="col members-container__col">{member.name}</div>
          <div className="col members-container__col">{member.age}</div>
          <div className="col members-container__col">{member.gender}</div>
          <div className="col members-container__col">{member.attached}</div>
          <div className="col members-container__col">{member.section}</div>
          <div className="col members-container__col">{member.cellNameKr}</div>
          <div className="col members-container__col">{member.isLeader ? 'O' : null}</div>
          <div className="col members-container__col">{member.isNetworkLeader ? 'O' : null}</div>
        </div>
      </>
    );
  };

  return (
    <>
      <h3 className="title"><Link to="/admin/members">멤버관리</Link></h3>
      <div className="container members-container">
        <div className="members-container__wrap">
          <div className="row members-container__row">
            <div className="col">번호</div>
            <div className="col">이름</div>
            <div className="col">나이</div>
            <div className="col">성별</div>
            <div className="col">소속</div>
            <div className="col">지역군</div>
            <div className="col">셀이름</div>
            <div className="col">리더</div>
            <div className="col">네트워크리더</div>
          </div>
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