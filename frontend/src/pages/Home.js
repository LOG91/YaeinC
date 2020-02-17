import React, { useEffect } from 'react';
import { CellTable } from '../components/CellTable';
import Tab from '../components/Tab/Tab';
import { attached, changeCurrentInfo, sheets, currentSheetId, networkCells } from '../store/modules/checker';
import { connect, useSelector, useDispatch } from 'react-redux';

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
}

const Home = (props) => {
  const { match, sheets, changeCurrentInfo } = props;
  const { name: current, attached } = match.params;
  const { modalOpend } = useSelector(state => state.checker);
  const isAdmin = match.url.match(/admin/g);
  
  useEffect(() => {
    console.log('shouldComponentUpdate');
    console.log(current);
    if (!current) {
      changeCurrentInfo('attached', attached);
      return;
    }
    changeCurrentInfo('idx', current);
    sheets.length && changeCurrentInfo('currentSheetId', sheets.find(v => v.name === current)._id);
    changeCurrentInfo('section', mapSectionByEnName(current));

    changeCurrentInfo('attached', attached);
  }, [current, attached]);
  
  useEffect(() => {
    console.log(attached);
    changeCurrentInfo('attached', attached);
    fetch(`/api/sheet/${attached}`).then(res => {
      return res;
    }).then(res => res.json())
      .then(sheets => {
        changeCurrentInfo('sheets', sheets);
        console.log(current);
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
            const mapped = networkCells.map(v => v.name);
            changeCurrentInfo('networkCells', networkCells);
            fetch(`/api/cells/${JSON.stringify(mapped)}`)
              .then(res => res.json())
              .then(cells => {
                changeCurrentInfo('currentSection', cells);
              });

          });
      });

  }, [])
  
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
  }

  const handlePrint = () => {
    printTargetNode({
      targetSelector: '.admin-table',
      nonDisplaySelector: ['.networkName-box'],
      nonDisplaySelectorAll: ['.cell-table__td__button', '.network-box__button']
    })
  }

  const handleToggleModal = ({ inner }) => {
    const { changeCurrentInfo } = props;
    changeCurrentInfo('currentModal', !modalOpend ? inner : null);
    changeCurrentInfo('modalOpend', !modalOpend);
  }


  return (
    <>
      <h3 className="title"><a href={isAdmin ? '/admin' : '/'}>출석체크</a></h3>
      {isAdmin ? (
        <div className="edit-box">
          <div className="button-box">
            {sheets.length === 0 ? (<div className="button-box__button--add-notify">시트를 추가하세요</div>) : null}
            <button
              className={`btn btn-outline-dark button-box__button ${sheets.length === 0 ? 'flashit' : ''}`}
              onClick={() => handleToggleModal({ inner: <Modal><SheetForm /></Modal> })}>시트 추가</button></div>
          <div className="button-box">
            <button
              className="btn btn-outline-dark button-box__button"
              onClick={handlePrint}>
              프린트
                </button>
          </div>
          <div className="button-box">
            <button
              className="btn btn-outline-dark button-box__button"
              onClick={() => handleToggleModal({ inner: <Modal onToggleModal={handleToggleModal}><ConfirmModal message="출석정보를 초기화하시겠습니까?" cancelAction={handleToggleModal} confirmAction={resetCheck} /></Modal> })}>
              초기화
                </button>
          </div>
        </div>
      ) : ''}
      <Tab currentSheet={current} sheets={sheets} attached={attached} isAdmin={isAdmin ? true : null} />
      {match.params.name ?
        <div className="admin-table"><CellTable isAdmin={isAdmin} current={match.params.name} /></div> :
        <div>
          <div className="root__description">{attached} 출석체크 페이지 :)</div>
          <div className="root__description">🇮🇱🇰🇷🇪🇬🇸🇾🇹🇷🇵🇸🇰🇵🇯🇴🇷🇺</div>
        </div>
      }
    </>
  )

}
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