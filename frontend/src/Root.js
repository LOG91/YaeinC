import React, { useState } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Home, Youth, Main } from './pages';
import { Layout } from './pages/Layout'
import { Footer } from './components/Footer';
import { Header, AdminHeader } from './components/Header';
import { SignInForm } from './components/SignInForm';
import { AuthRoute } from './components/AuthRoute';
import { FortalModal } from './components/Modal';

import { signIn } from './temp/auth'


const Root = (props) => {
  const { currentModal, modalOpend } = props;
  const [user, setUser] = useState(null);
  const authenticated = user != null;

  const signin = ({ email, password }) => setUser(signIn({ email, password }));
  const signout = () => setUser(null);

  console.log(props);

  return (
    <BrowserRouter>
      <Layout Header={Header} Footer={Footer}>
        <div className="main-container">
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={Main} />
              {/* <Route exact path="/admin" component={Main} /> */}
              <AuthRoute
                authenticated={authenticated}
                exact
                path="/admin"
                render={props => <Main user={user} {...props} />}
              />
              <Route
                path="/signin"
                exact
                render={props => (
                  <SignInForm authenticated={authenticated} signin={signin} {...props} />
                )}
              />
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