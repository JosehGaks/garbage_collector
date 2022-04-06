import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { CircularProgress, makeStyles } from '@material-ui/core';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';

const useStyles = makeStyles(() => ({
  '@global': {
    'html, body, #root': {
      height: '100%',
      margin: 0,
      padding: 0,
    },
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
}));

const Activate = () => {
  const classes = useStyles();
  const { storeToken } = useAuth();
  const history = useHistory();
  const location = useLocation();
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    if (token) {
      api
        .patch(`/users/activate`, { token })
        .then(({ data }) => {
          storeToken(data.access_token);
          history.push('/');
        })
        .catch(() => {
          history.replace('/');
        });
    }
  }, [location]);

  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  );
};

export default Activate;
