import React from 'react';
import PropTypes from 'prop-types';
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
} from '@material-ui/core';
import UserMenu from '../main/UserMenu';
import { useAuth } from '../../../contexts/AuthContext';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(0),
    height: '100%',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    ...theme.mixins.toolbar,
  },
  grow: {
    flexGrow: 1,
  },
}));

const ClientLayout = ({ children }) => {
  const classes = useStyles();
  const { token } = useAuth();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Waste Management System
          </Typography>
          <div className={classes.grow} />
          {token?.sub ? <UserMenu /> : null}
        </Toolbar>
      </AppBar>
      <div className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </div>
    </div>
  );
};

ClientLayout.propTypes = {
  children: PropTypes.element.isRequired,
};
export default ClientLayout;
