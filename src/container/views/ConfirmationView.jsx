import React from 'react';
import { Container, Typography, Button, makeStyles } from '@material-ui/core';
import { useAuth } from '../../contexts/AuthContext';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionSection: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));
const ConfirmationView = () => {
  const classes = useStyles();
  const { user } = useAuth();
  return (
    <Container className={classes.root}>
      <img width="200" src="/verify_email.svg" alt="verify your email" />
      <Typography variant="h2" align="center">
        Please verify your email address
      </Typography>
      <Typography paragraph align="center">
        Before using our waste management application, we need you to verify your
        email address.
      </Typography>
      <Typography paragraph align="center">
        An email containing verification instructions was sent to{' '}
        <strong>{user?.email}</strong>.
      </Typography>
      <div className={classes.actionSection}>
        <Button variant="outlined" color="primary">
          Resend verification email
        </Button>
        <Button variant="outlined" color="primary">
          Change email
        </Button>
      </div>
    </Container>
  );
};

export default ConfirmationView;
