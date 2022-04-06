import React, { useState } from 'react';
import {
  Paper,
  Box,
  TextField,
  Button,
  Link,
  Grid,
  makeStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  FormHelperText,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { useAuth } from '../contexts/AuthContext';

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 500,
    margin: 'auto',
  },
}));

const validationSchema = yup.object({
  first_name: yup.string('Enter your first name').required('First Name is required'),
  last_name: yup.string('Enter your last name').required('Last Name is required'),
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  username: yup.string('Enter your username').required('Username is required'),
  gender: yup.string('Enter your gender').required('Gender is required'),
  password: yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  confirmPassword: yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
});

const initialValues = {
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  gender: '',
};

const SignUp = () => {
  const [error, onError] = useState(null);
  const [loading, onLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();
  const { signUp } = useAuth();
  const onSubmit = async (data) => {
    onLoading(true);
    try {
      await signUp(data);
      onError(null);
      onLoading(false);
      history.replace('/');
    } catch (err) {
      onError(err.response.data);
      onLoading(false);
    }
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
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              name="first_name"
              label="First Name"
              value={form.values.first_name}
              onChange={form.handleChange}
              error={form.touched.first_name && Boolean(form.errors.first_name)}
              helperText={form.touched.first_name && form.errors.first_name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              name="last_name"
              label="Last Name"
              value={form.values.last_name}
              onChange={form.handleChange}
              error={form.touched.last_name && Boolean(form.errors.last_name)}
              helperText={form.touched.last_name && form.errors.last_name}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              variant="outlined"
              name="email"
              label="Email"
              value={form.values.email}
              onChange={form.handleChange}
              error={form.touched.email && Boolean(form.errors.email)}
              helperText={form.touched.email && form.errors.email}
            />
          </Grid>
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
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              name="password"
              label="Password"
              value={form.values.password}
              onChange={form.handleChange}
              error={form.touched.password && Boolean(form.errors.password)}
              helperText={form.touched.password && form.errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              label="Confirm Password"
              value={form.values.confirmPassword}
              onChange={form.handleChange}
              error={
                form.touched.confirmPassword && Boolean(form.errors.confirmPassword)
              }
              helperText={
                form.touched.confirmPassword && form.errors.confirmPassword
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl
              variant="outlined"
              fullWidth
              error={form.touched.gender && Boolean(form.errors.gender)}
            >
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                id="gender"
                label="Gender"
                name="gender"
                labelId="gender-label"
                value={form.values.gender}
                onChange={form.handleChange}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">other</MenuItem>
              </Select>
              <FormHelperText>
                {form.touched.gender && form.errors.gender}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item>
            <Link component={RouterLink} to="/login">
              Sign in instead
            </Link>
          </Grid>
          <Grid item>
            <Button
              size="large"
              type="submit"
              color="primary"
              variant="contained"
              disabled={loading}
            >
              SignUp
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </form>
  );
};

export default SignUp;
