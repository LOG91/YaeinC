import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCross, faUserCircle } from '@fortawesome/free-solid-svg-icons';

import { Home, Youth, Main } from './pages';
import { FortalModal } from './components/Modal';


const Root = ({ currentModal, modalOpend }) => {
  return (
    <BrowserRouter>
      <Switch>
        <div className="main-container">
          <nav className="nav-box">
            <h1 className="logo-box">
              <a href="/"><div className="logo-box__desc">Yaein Church</div></a><FontAwesomeIcon className="logo-box__logo" icon={faCross} />
            </h1>
            <ul className="nav-box__list">
            </ul>
            <div className="logo-box">
              <a><FontAwesomeIcon className="logo-box__logo--user" icon={faUserCircle} /></a>
            </div>
          </nav>
          <div>
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