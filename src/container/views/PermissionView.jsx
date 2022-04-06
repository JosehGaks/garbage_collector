import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
  Button,
  Grid,
  LinearProgress,
  Snackbar,
} from '@material-ui/core';
import { Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Alert } from '@material-ui/lab';
import { useCreate, useDelete, useGet } from '../../api';

const RoleValidationSchema = yup.object({
  name: yup.string('Enter the Prermission').required('Permission is required'),
  description: yup
    .string('Enter role description')
    .required('description is required'),
});

const RoleInitialValues = {
  name: '',
  description: '',
};

const PermissionView = () => {
  const [permissionAdded, onPermissionAdded] = useState(false);
  const {
    payload: permissionsPayload,
    setPayload: setPermissions,
    getAll: getPermission,
  } = useGet('/permissions');

  const {
    create: createPermission,
    isPending: loading,
    error: addPermissionError,
    onError: onPermissionError,
  } = useCreate('/permissions', ({ permission, success }) => {
    setPermissions((oldPermissions) => ({
      permissions: [permission, ...oldPermissions.permissions],
    }));
    onPermissionAdded(success);
  });
  const { deleteItem: deletePermission } = useDelete(
    '/permissions',
    (primaryKey) => {
      setPermissions(({ permissions }) => {
        const newPermission = permissions.filter(({ name }) => name !== primaryKey);
        return { permissions: newPermission };
      });
    }
  );

  const handleDeletePermission = (permission) => () => deletePermission(permission);
  useEffect(getPermission, []);

  const permissionForm = useFormik({
    initialValues: RoleInitialValues,
    validationSchema: RoleValidationSchema,
    onSubmit: createPermission,
  });
  return (
    <Container>
      <Box
        pt={1}
        pb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h4" display="inline">
          Add a Permission
        </Typography>
      </Box>
      <Typography paragraph>Define the permissions that this API uses.</Typography>
      <form onSubmit={permissionForm.handleSubmit}>
        <Grid container spacing={1}>
          <Grid item xs>
            <TextField
              fullWidth
              size="small"
              disabled={loading}
              variant="outlined"
              name="name"
              label="Permission"
              value={permissionForm.values.name}
              onChange={permissionForm.handleChange}
              error={
                permissionForm.touched.name && Boolean(permissionForm.errors.name)
              }
              helperText={permissionForm.touched.name && permissionForm.errors.name}
            />
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              size="small"
              disabled={loading}
              variant="outlined"
              name="description"
              label="description"
              value={permissionForm.values.description}
              onChange={permissionForm.handleChange}
              error={
                permissionForm.touched.description &&
                Boolean(permissionForm.errors.description)
              }
              helperText={
                permissionForm.touched.description &&
                permissionForm.errors.description
              }
            />
          </Grid>
          <Grid item xs="auto">
            <Button
              type="submit"
              disabled={loading}
              startIcon={<AddIcon />}
              variant="outlined"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
      <Box
        pt={3}
        pb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h4" display="inline">
          List of Permissions
        </Typography>
      </Box>

      <Typography paragraph>
        These are all the permissions that this API uses.
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="user table">
          <TableHead>
            <TableRow>
              <TableCell>name</TableCell>
              <TableCell>description</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell padding="none" colSpan={3}>
                  <LinearProgress />
                </TableCell>
              </TableRow>
            ) : null}
            {permissionsPayload &&
              permissionsPayload.permissions.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={handleDeletePermission(row.name)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={addPermissionError}
        autoHideDuration={6000}
        onClose={() => onPermissionError(null)}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity="error"
          onClick={() => onPermissionError(null)}
        >
          {addPermissionError?.response?.data?.message}
        </Alert>
      </Snackbar>
      <Snackbar
        open={permissionAdded}
        autoHideDuration={6000}
        onClose={() => onPermissionAdded(false)}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity="success"
          onClick={() => onPermissionAdded(false)}
        >
          Permission is added successfully
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PermissionView;
