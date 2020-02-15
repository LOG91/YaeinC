import React from 'react';
import { Route, Redirect } from 'react-router-dom';

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
}

export default AuthRoute;