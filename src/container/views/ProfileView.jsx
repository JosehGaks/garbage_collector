import React from 'react';
import {
  Typography,
  CircularProgress,
  makeStyles,
  Container,
  Paper,
  Grid,
} from '@material-ui/core';
import { useAuth } from '../../contexts/AuthContext';

const useStyles = makeStyles((theme) => ({
  '@global': {
    'html, body, #root': {
      height: '100%',
      margin: 0,
      padding: 0,
    },
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  root: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(3),
  },
}));

const ProfileView = () => {
  const classes = useStyles();
  const { user } = useAuth();

  return user ? (
    <Container className={classes.root} component={Paper}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h3">
            {user.first_name} {user.last_name}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography color="textSecondary">Username</Typography>
          <Typography>{user.user_name}</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography color="textSecondary">Email</Typography>
          <Typography>{user.email}</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography color="textSecondary">Role</Typography>
          <Typography>{user.role}</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography color="textSecondary">Gender</Typography>
          <Typography>{user.gender}</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography color="textSecondary">Birth date</Typography>
          <Typography>{user.date_of_birth}</Typography>
        </Grid>
      </Grid>
    </Container>
  ) : (
    <div className={classes.loading}>
      <CircularProgress />
    </div>
  );
};
export default ProfileView;
