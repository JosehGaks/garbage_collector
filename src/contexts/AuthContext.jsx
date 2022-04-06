import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import jwt from 'jwt-decode';
import { useHistory } from 'react-router-dom';
import api, { useGet } from '../api';

const AuthContext = createContext(undefined);

export const useAuth = () => useContext(AuthContext);

export function hasAccess(appPermissions, userPermissions) {
  for (let index = 0; index < appPermissions.length; index += 1) {
    if (userPermissions.includes(appPermissions[index])) return true;
  }
  return false;
}

const getToken = () => {
  const localToken = localStorage.getItem('access_token');
  if (localToken) {
    return jwt(localToken);
  }
  return null;
};

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getToken());
  const [errors, setErrors] = useState(null);
  const [pending, setPending] = useState(false);
  const { payload: userPayload, getByPK: getUser } = useGet('/users');
  const history = useHistory();

  function storeToken(accessToken) {
    localStorage.setItem('access_token', accessToken);
    const encodedToken = jwt(accessToken);
    setToken(encodedToken);
  }

  const permissions = React.useMemo(() => {
    if (token?.permissions) {
      return token.permissions;
    }
    return [];
  }, [token]);

  useEffect(() => getUser(token?.sub), [token]);

  async function signUp(formData) {
    const { data } = await api.post('/users', formData);
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    const accessToken = jwt(data.access_token);
    setToken(accessToken);
    history.replace('/');
  }

  function signIn(formData, from) {
    setPending(true);
    api
      .post('/users/auth', formData)
      .then(({ data }) => {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        const accessToken = jwt(data.access_token);
        setToken(accessToken);
        setPending(false);
        setErrors(null);
        history.replace(from);
      })
      .catch(({ response }) => {
        setErrors(response.data);
        setPending(false);
      });
  }

  function logOut() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
  }

  const value = {
    token,
    permissions,
    pending,
    errors,
    user: userPayload?.user,
    signUp,
    signIn,
    logOut,
    storeToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default AuthProvider;
