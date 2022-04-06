import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Box,
  Button,
  Container,
  Link,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { Alert } from '@material-ui/lab';
import { Add as AddIcon } from '@material-ui/icons';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useCreate, useGet, useUpdate } from '../../api';
import SubmitModal from '../../component/SubmitModal';
import MoreOptions from '../../component/MoreOptions';
import UserCombox from '../../component/UserCombox';

const useStyles = makeStyles((theme) => ({
  inputMargin: {
    '& > *': {
      marginBottom: theme.spacing(2),
    },
  },
}));

const RoleValidationSchema = yup.object({
  name: yup.string('Enter role name').required('role name is required'),
  description: yup
    .string('Enter role description')
    .required('description is required'),
});

const RoleInitialValues = {
  name: '',
  description: '',
};

const RoleView = () => {
  const classes = useStyles();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [open, setOpen] = useState(false);
  const [userDialog, setUserDialog] = useState(false);

  const { payload: rolesPayload, getAll: getRole } = useGet('/roles');
  const { create: createRole } = useCreate('/roles');
  const {
    payload: successPayload,
    setPayload: setSuccessPayload,
    update: assignRole,
    isPending: assignRoleToUser,
  } = useUpdate('/users');

  const assignUserHandler = (event, name) => {
    setSelectedRole(name);
    setUserDialog(true);
  };

  const assignRoleToUserHandler = (event) => {
    event.preventDefault();
    assignRole({ role_name: selectedRole }, `${selectedUser.id}/roles`);
    setUserDialog(false);
  };
  useEffect(() => {
    getRole();
  }, []);
  // const handleUserRole = (event) => setUserRole(event.target.value);
  const roleForm = useFormik({
    initialValues: RoleInitialValues,
    validationSchema: RoleValidationSchema,
    onSubmit: createRole,
  });
  const [actions] = useState([
    { label: 'View Details', onClick: () => null },
    { label: 'Assign To User', onClick: assignUserHandler },
    { label: 'Delete', onClick: () => null },
  ]);
  return (
    <Container>
      <Box
        pt={1}
        pb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h3" display="inline">
          Role
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Create Role
        </Button>
      </Box>
      <Typography paragraph>
        Create and manage Roles for your applications. Roles contain collections of
        Permissions and can be assigned to Users.
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
            {rolesPayload &&
              rolesPayload.roles.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    <Link component={RouterLink} to={`/roles/${row.name}`}>
                      {row.name}
                    </Link>
                  </TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell align="right">
                    <MoreOptions id={row.name} actions={actions} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <SubmitModal
        title="Assign Role To User"
        open={userDialog}
        submitLabel="Assign"
        onSubmit={assignRoleToUserHandler}
        loading={assignRoleToUser}
        onClose={() => setUserDialog(false)}
      >
        <UserCombox setUser={setSelectedUser} />
      </SubmitModal>
      <SubmitModal
        title="Create Role"
        open={open}
        submitLabel="Create"
        onSubmit={roleForm.handleSubmit}
        onClose={() => setOpen(false)}
      >
        <div className={classes.inputMargin}>
          <TextField
            fullWidth
            variant="outlined"
            name="name"
            label="Name"
            value={roleForm.values.name}
            onChange={roleForm.handleChange}
            error={roleForm.touched.name && Boolean(roleForm.errors.name)}
            helperText={roleForm.touched.name && roleForm.errors.name}
          />
          <TextField
            fullWidth
            variant="outlined"
            name="description"
            label="Description"
            value={roleForm.values.description}
            onChange={roleForm.handleChange}
            error={
              roleForm.touched.description && Boolean(roleForm.errors.description)
            }
            helperText={roleForm.touched.description && roleForm.errors.description}
          />
        </div>
      </SubmitModal>
      <Snackbar
        open={successPayload?.success}
        autoHideDuration={6000}
        onClose={() => setSuccessPayload(false)}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity="success"
          onClick={() => setSuccessPayload(false)}
        >
          Role is assigned successfully
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RoleView;
