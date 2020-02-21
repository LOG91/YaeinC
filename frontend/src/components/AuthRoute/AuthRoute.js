import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { authenticated } from '../../store/modules/checker';

const AuthRoute = ({ authenticated, component: Component, render, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        authenticated ? (
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
  authenticated: state.checker.authenticated
});

export default connect(mapStateToProps, null)(AuthRoute);