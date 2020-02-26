import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { authenticated } from '../../store/modules/checker';

const AuthRoute = ({ authenticated, component: Component, render, status, ...rest }) => {
  useEffect(() => {
    if (status.isLoggedIn) {
      console.log(`${status.currentUser} 님 환영합니다`);
    }
  }, []);

  return (
    <Route
      {...rest}
      render={props =>
        status.isLoggedIn ? (
          render ? render(props) : <Component {...props} />
        ) : (
            <Redirect
              to={{ pathname: '/signin', state: { from: props.location } }}
            />
          )
      }
    />
  );
};

const mapStateToProps = state => ({
  authenticated: state.checker.authenticated,
  status: state.signin.status
});

export default connect(mapStateToProps, null)(AuthRoute);