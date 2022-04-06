import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContext';

const GuardRoute = ({ children, path, exact }) => {
  const { token } = useAuth();
  const renderAuthView = ({ location }) => {
    if (token?.sub) {
      return <Redirect to="/" />;
    }
    if (token && !token.active) {
      return (
        <Redirect
          to={{
            pathname: '/confirm',
            state: { from: location },
          }}
        />
      );
    }
    return children;
  };
  return <Route exact={exact} path={path} render={renderAuthView} />;
};

GuardRoute.defaultProps = {
  exact: null,
};

GuardRoute.propTypes = {
  children: PropTypes.element.isRequired,
  path: PropTypes.string.isRequired,
  exact: PropTypes.string,
};

export default GuardRoute;
