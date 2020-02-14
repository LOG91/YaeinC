import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCross, faUserCircle, } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faTwitch, faYoutube } from '@fortawesome/free-brands-svg-icons';

import { Home, Youth, Main } from './pages';
import { Layout } from './pages/Layout'
import { Footer } from './components/Footer';
import { Header, AdminHeader } from './components/Header';
import { FortalModal } from './components/Modal';


const Root = (props) => {
  const { currentModal, modalOpend } = props;
  console.log(props);
  return (
    <BrowserRouter>
      <Layout Header={Header} Footer={Footer}>
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
      </Layout>

      {modalOpend ?
        (<FortalModal>
          {currentModal}
        </FortalModal>) :
        null
      }
    </BrowserRouter>
  )
}

const mapStateToProps = (state) => ({
  currentModal: state.checker.currentModal,
  modalOpend: state.checker.modalOpend
});

export default connect(mapStateToProps)(Root);