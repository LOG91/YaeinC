import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CellTable } from '../components/CellTable';
import Tab from '../components/Tab/Tab';
import { changeCurrentInfo } from '../store/modules/checker';


import { Modal } from '../components/Modal';
import ConfirmModal from '../components/Modal/ConfirmModal';
import SheetForm from '../components/AddForm/SheetForm';

import { printTargetNode } from '../fn/fn';

const mapSectionByEnName = (enName) => {
  const section =
    enName.match(/이스라엘/g) ?
      '이스라엘군' : enName.match(/아랍/g) ?
        '아랍군' : enName.match(/아시아/g) ? '아시아군'
          : null;

  return section;
};

const Home = (props) => {
  const { match, sheets, changeCurrentInfo, networkCells } = props;
  const { name: current, attached } = match.params;
  const { modalOpend } = useSelector(state => state.checker);
  const isAdmin = match.url.match(/admin/g);


  useEffect(() => {
    changeCurrentInfo('attached', attached);
    fetch(`/api/sheet/${attached}`).then(res => {
      return res;
    }).then(res => res.json())
      .then(sheets => {
        changeCurrentInfo('sheets', sheets);
        if (!current) {
          return;
        }
        changeCurrentInfo('idx', current);
        changeCurrentInfo('section', mapSectionByEnName(current));
        changeCurrentInfo('attached', attached);
        const currentSheetId = sheets.length && sheets.find(v => v.name === current)._id;
        changeCurrentInfo('currentSheetId', currentSheetId);
        fetch(`/api/networkCell/${currentSheetId}`)
          .then(res => res.json())
          .then(networkCells => {
            changeCurrentInfo('networkCells', networkCells);
            fetch(`/api/cells?cells=${JSON.stringify(networkCells)}`)
              .then(res => res.json())
              .then(cells => {
                changeCurrentInfo('currentSection', cells);
              });

          });
      });
    return () => { changeCurrentInfo('currentSection', null); };
  }, [current, attached]);

  const resetCheck = () => {
    const currentLocation = window.location.href;
    fetch('/api/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentLocation })
    }).then(() => {
      window.location.href = window.location.href;
    });
  };

  const handlePrint = () => {
    printTargetNode({
      targetSelector: '.admin-table',
      nonDisplaySelector: ['.networkName-box'],
      nonDisplaySelectorAll: ['.cell-table__td__button', '.network-box__button']
    });
  };

  const handleToggleModal = ({ inner }) => {
    const { changeCurrentInfo } = props;
    changeCurrentInfo('currentModal', !modalOpend ? inner : null);
    changeCurrentInfo('modalOpend', !modalOpend);
  };


  return (
    <>
      <h3 className="title"><Link to={isAdmin ? '/admin' : '/'}>출석체크</Link></h3>
      {(isAdmin && sheets.length !== 0) ? (
        <div className="edit-box">
          <div className="button-box">
            <button
              className={"btn btn-outline-dark button-box__button"}
              onClick={() => handleToggleModal({ inner: <Modal><SheetForm /></Modal> })}>시트 추가</button></div>
          <div className="button-box">
            <button
              className="btn btn-outline-dark button-box__button"
              onClick={() => handleToggleModal({ inner: <Modal onToggleModal={handleToggleModal}><ConfirmModal message="출석정보를 초기화하시겠습니까?" cancelAction={handleToggleModal} confirmAction={resetCheck} /></Modal> })}>
              초기화
                </button>
          </div>
          {networkCells.length !== 0 ? (<div className="button-box">
            <button
              className="btn btn-outline-dark button-box__button"
              onClick={handlePrint}>
              프린트
                </button>
          </div>) : null}
        </div>
      ) : ''}
      <Tab currentSheet={current} sheets={sheets} attached={attached} isAdmin={isAdmin ? true : null} />
      {match.params.name ?
        <div className="admin-table"><CellTable isAdmin={isAdmin} current={match.params.name} /></div> :
        <div>
          <div className="root__description">{attached} 출석체크 페이지 :)</div>
          <div className="root__description">🇮🇱🇰🇷🇪🇬🇸🇾🇹🇷🇵🇸🇰🇵🇯🇴🇷🇺</div>
          {sheets.length === 0 ? (<div className="sheet-container" onClick={() => handleToggleModal({ inner: <Modal><SheetForm /></Modal> })}>
            <div className="sheet-container__description">시트가 없습니다 추가해보세요</div>
            <div className="sheet-container__icon"><FontAwesomeIcon icon={faPlusCircle} /></div>
          </div>) : null}
        </div>
      }
    </>
  );

};
const mapStateToProps = (state) => ({
  currentSection: state.checker.currentSection,
  attached: state.checker.attached,
  sheets: state.checker.sheets,
  networkCells: state.checker.networkCells,
  modalOpend: state.checker.modalOpend
});

const mapDispatchToProps = dispatch => ({
  changeCurrentInfo: (left, right) => dispatch(changeCurrentInfo(left, right)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);