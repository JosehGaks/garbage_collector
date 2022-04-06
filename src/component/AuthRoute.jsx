import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth, hasAccess } from '../contexts/AuthContext';

const AuthRoute = ({ children, path, exact, exclude, appPermissions }) => {
  const { token, permissions } = useAuth();
  const renderAuthView = ({ location }) => {
    if (!token?.sub) {
      return (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: location },
          }}
        />
      );
    }
    if (!exclude && !token.active) {
      return (
        <Redirect
          to={{
            pathname: '/confirm',
            state: { from: location },
          }}
        />
      );
    }
    if (appPermissions.length && !hasAccess(appPermissions, permissions))
      return (
        <Redirect
          to={{
            pathname: '/notfound',
            state: { from: location },
          }}
        />
      );
    return children;
  };
  return <Route exact={exact} path={path} render={renderAuthView} />;
};

AuthRoute.defaultProps = {
  exact: false,
  exclude: false,
  appPermissions: [],
};

AuthRoute.propTypes = {
  children: PropTypes.element.isRequired,
  path: PropTypes.string.isRequired,
  exact: PropTypes.bool,
  exclude: PropTypes.bool,
  appPermissions: PropTypes.arrayOf(PropTypes.string),
};

export default AuthRoute;
