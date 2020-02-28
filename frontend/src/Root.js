import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Main, AdminMain } from './pages';
import { SignInForm, RegisterForm } from './components/SignIn';
import { FortalModal } from './components/Modal';

import { signIn } from './temp/auth';
import { getStatusRequest } from './store/modules/signin';
import { MemberList } from './components/MemberList';


const Root = (props) => {
  const { currentModal, modalOpend, history } = props;
  const [user, setUser] = useState(null);
  const authenticated = user != null;

  const signin = ({ email, password }) => setUser(signIn({ email, password }));
  const signout = () => setUser(null);

  useEffect(() => {
    const getCookie = (name) => {
      let value = '; ' + document.cookie;
      let parts = value.split('; ' + name + '=');
      if (parts.length === 2) return parts.pop();
    };

    let loginData = getCookie('key');
    if (typeof loginData === 'undefined') return;
    loginData = JSON.parse(atob(loginData));
    if (!loginData.isLoggedIn) return;
    props.getStatusRequest().then(
      (res) => {
        if (!props.status.valid) {
          loginData = {
            isLoggedIn: false,
            username: ''
          };
        }
      }
    );
  }, []);

  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route
            exact
            path="/admin"
            render={prop => <AdminMain prop={prop} authenticated={props.status} />}
          />
          <Route
            path="/signin"
            exact
            render={props => (
              <SignInForm authenticated={authenticated} signin={signin} {...props} />
            )}
          />
          <Route
            path="/register"
            exact
            render={props => (
              <RegisterForm authenticated={authenticated} signin={signin} {...props} />
            )}
          />
          <Route path="/admin/:attached/:name" component={AdminMain} />
          <Route exact path="/admin/:attached" component={AdminMain} />
          <Route exact path="/:attached" component={Main} />
          <Route path="/:attached/:name" component={Main} />
          {/* <Route path="/admin/:attached/youth_m" component={Youth} />
          <Route path="/admin/:attached/youth_w" component={Youth} />
          <Route path="/:attached/youth_m" component={Youth} />
          <Route path="/:attached/youth_w" component={Youth} /> */}
          <Route>
            <div>404 Page</div>
          </Route>
        </Switch>
      </BrowserRouter>

      {
        modalOpend ?
          (<FortalModal>
            {currentModal}
          </FortalModal>) :
          null
      }
    </>
  );
};

const mapStateToProps = (state) => ({
  currentModal: state.checker.currentModal,
  modalOpend: state.checker.modalOpend,
  status: state.signin.status
});

const mapStateToDispatch = (dispatch) => ({
  getStatusRequest: () => dispatch(getStatusRequest())
});

export default connect(mapStateToProps, mapStateToDispatch)(Root);