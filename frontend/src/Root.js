import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCross, faUserCircle, } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faTwitch, faYoutube } from '@fortawesome/free-brands-svg-icons';

import { Home, Youth, Main } from './pages';
import { FortalModal } from './components/Modal';


const Root = ({ currentModal, modalOpend }) => {
  return (
    <BrowserRouter>
      <Switch>
        <div className="root-container">
          <nav className="nav-box">
            <h1 className="logo-box">
              <a className="logo-box__a" href="/"><div className="logo-box__desc">Yaein</div></a>
            </h1>
            <div className="nav-box__flex">
              <ul className="nav-box__list">
                <li className="nav-box__item"><a href="/" className="nav-box__a">출석체크</a></li>
                <li className="nav-box__item"><a href="#" className="nav-box__a">교회소식</a></li>
                <li className="nav-box__item"><a href="#" className="nav-box__a">소식과 나눔</a></li>
                <li className="nav-box__item"><a href="#" className="nav-box__a">교회학교</a></li>
              </ul>
            </div>
            <div className="logo-box">
              <a><FontAwesomeIcon className="logo-box__logo--user" icon={faUserCircle} /></a>
            </div>
          </nav>
          <div className="main-container">
            <BrowserRouter>
              <Switch>
                <Route exact path="/" component={Main} />
                <Route exact path="/admin" component={Main} />
                <Route path="/admin/:attached/youth_m" component={Youth} />
                <Route path="/admin/:attached/youth_w" component={Youth} />
                <Route path="/admin/:attached/:name" component={Home} />
                <Route exact path="/:attached" component={Home} />
                <Route exact path="/admin/:attached" component={Home} />
                <Route path="/:attached/youth_m" component={Youth} />
                <Route path="/:attached/youth_w" component={Youth} />
                <Route path="/:attached/:name" component={Home} />
                <Route>
                  <div>404 Page</div>
                </Route>
              </Switch>
            </BrowserRouter>
          </div>
          {modalOpend ?
            (<FortalModal>
              {currentModal}
            </FortalModal>) :
            null
          }
          <footer className="footer">
            <div className="footer-main">
              <div className="footer-main__logo">Yaein</div>
              <div className="positioning--rel">
              <ul className="footer-main__list">
                <li className="footer-main__item">
                  <a href="https://www.instagram.com/yaein_holy/" target="_blank" className="footer-main__a">
                    <FontAwesomeIcon className="footer-main__logo--sns" icon={faInstagram} />
                  </a>
                </li>
                <li className="footer-main__item">
                  <a href="#" className="footer-main__a">
                    <FontAwesomeIcon className="footer-main__logo--sns" icon={faTwitch} />
                  </a>
                </li>
                <li className="footer-main__item">
                  <a href="https://www.youtube.com/channel/UCU8p5jB-jdIdg3ey_MTg1Wg" target="_blank" className="footer-main__a">
                    <FontAwesomeIcon className="footer-main__logo--sns" icon={faYoutube} />
                  </a>
                </li>
              </ul>
              </div>
            </div>
            <div className="footer-main__description">16706 경기도 수원시 영통구 매영로 269번길 15  TEL : 031-204-5004  |  FAX : 031-205-9181</div>
          </footer>
        </div>
      </Switch>
    </BrowserRouter>
  )
}

const mapStateToProps = (state) => ({
  currentModal: state.checker.currentModal,
  modalOpend: state.checker.modalOpend
});

export default connect(mapStateToProps)(Root);