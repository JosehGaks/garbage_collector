import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { Alert } from '@material-ui/lab';
import { useGet, useUpdate } from '../../api';
import SubmitModal from '../../component/SubmitModal';
import MoreOptions from '../../component/MoreOptions';

const UserView = () => {
  const [userRole, setUserRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const { payload, getAll } = useGet('/users');
  const { payload: rolesPayload, getAll: getRole } = useGet('/roles');
  const {
    payload: successPayload,
    setPayload: setSuccessPayload,
    update,
  } = useUpdate(`/users/${selectedUser}/roles`);
  const assignRole = (event, id) => {
    setSelectedUser(id);
    setOpen(true);
  };
  const [actions] = useState([
    { label: 'View Details', onClick: () => null },
    { label: 'Assign Role', onClick: assignRole },
    { label: 'Block', onClick: () => null },
    { label: 'Delete', onClick: () => null },
  ]);
  const handleSubmit = (event) => {
    event.preventDefault();
    update({ role_name: userRole });
    setOpen(false);
  };
  useEffect(() => {
    getAll();
    getRole();
  }, []);
  const handleUserRole = (event) => setUserRole(event.target.value);
  return (
    <Container>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Create User
      </Button>
      <br />
      <br />

      <TableContainer component={Paper}>
        <Table aria-label="user table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>role</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {payload &&
              payload.user.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    <Link component={RouterLink} to={`/users/show/${row.id}`}>
                      {row.first_name} {row.last_name}
                    </Link>
                    <Typography variant="body2" color="textSecondary">
                      {row.email}
                    </Typography>
                  </TableCell>
                  <TableCell>{row.user_name}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell align="right">
                    <MoreOptions id={row.id} actions={actions} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <SubmitModal
        title="Assign Role"
        open={open}
        submitLabel="Assign"
        onSubmit={handleSubmit}
        onClose={() => setOpen(false)}
      >
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="select-role">Role</InputLabel>
          <Select
            id="select-role"
            label="Role"
            value={userRole}
            onChange={handleUserRole}
          >
            {rolesPayload &&
              rolesPayload.roles.map((role) => (
                <MenuItem key={role.name} value={role.name}>
                  {role.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
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

export default UserView;
