import React from 'react';
import {
  Paper,
  Box,
  TextField,
  Button,
  Grid,
  makeStyles,
  Link,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 500,
    margin: 'auto',
  },
}));

const validationSchema = yup.object({
  username: yup.string('Enter your username').required('Username is required'),
  password: yup
    .string('Enter your password')
    .min(4, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
});

const initialValues = {
  username: '',
  password: '',
};

const Login = () => {
  const location = useLocation();

  const { signIn, pending: loading, errors: error } = useAuth();
  const onSubmit = (data) => {
    const { from } = location.state || { from: { pathname: '/' } };
    signIn(data, from);
  };

  const classes = useStyles();
  const form = useFormik({ initialValues, validationSchema, onSubmit });
  return (
    <form onSubmit={form.handleSubmit}>
      <Paper className={classes.root}>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          component={Box}
          px={4}
          py={2}
          spacing={2}
        >
          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error.message}</Alert>
            </Grid>
          )}
          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              variant="outlined"
              name="username"
              label="Username"
              value={form.values.username}
              onChange={form.handleChange}
              error={form.touched.username && Boolean(form.errors.username)}
              helperText={form.touched.username && form.errors.username}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              variant="outlined"
              name="password"
              label="Password"
              value={form.values.password}
              onChange={form.handleChange}
              error={form.touched.password && Boolean(form.errors.password)}
              helperText={form.touched.password && form.errors.password}
            />
          </Grid>
          <Grid item>
            <Link component={RouterLink} to="/register">
              Create Account
            </Link>
          </Grid>
          <Grid item>
            <Button
              fullWidth
              size="large"
              type="submit"
              color="primary"
              variant="contained"
              disabled={loading}
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </form>
  );
};

export default Login;
