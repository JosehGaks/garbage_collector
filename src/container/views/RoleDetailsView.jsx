import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Typography,
  Button,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  LinearProgress,
} from '@material-ui/core';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useParams } from 'react-router-dom';
import {
  Delete as DeleteIcon,
  Save as SaveIcon,
  Add as AddIcon,
} from '@material-ui/icons';
import Checkbox from '@material-ui/core/Checkbox';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import SubmitModal from '../../component/SubmitModal';
import { useDelete, useGet, useUpdate } from '../../api';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const RoleValidationSchema = yup.object({
  name: yup.string('Enter the Prermission').required('Permission is required'),
  description: yup
    .string('Enter role description')
    .required('description is required'),
});

const RoleDetailsView = () => {
  const { role } = useParams();
  const [permissionDialogOpen, setPermissionDialogState] = useState(false);
  const [value, setValue] = useState([]);
  const [options, setOptions] = useState([]);
  const { payload: allPermissionsPayload, getAll: getAllPermissions } = useGet(
    '/permissions'
  );
  const {
    payload: permissionsPayload,
    setPayload: setPermissionPayload,
    getAll: getPermissions,
  } = useGet(`/roles/${role}/permissions`);

  const { update: addPermissions, isPending: addingPermissions } = useUpdate(
    '/roles',
    () => {
      getPermissions();
      setPermissionDialogState(false);
      setValue([]);
    }
  );
  const {
    deleteItems: removePermissions,
    isPending: removingPermisisons,
  } = useDelete(`/roles/${role}/permissions`, ({ permissions }) => {
    setPermissionPayload((oldData) => {
      const newData = oldData;
      const newPermissions = oldData?.role.permissions.filter(
        (permission) => !permissions.includes(permission.name)
      );
      newData.role.permissions = newPermissions;
      return { ...newData };
    });
  });
  const roleForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: permissionsPayload?.role.name ?? '',
      description: permissionsPayload?.role.description ?? '',
    },
    validationSchema: RoleValidationSchema,
    // onSubmit: createPermission,
  });

  React.useMemo(() => {
    const assignedPermissionKeys = new Set(
      permissionsPayload?.role.permissions?.map(({ name }) => name)
    );
    const newOptions = allPermissionsPayload?.permissions.filter(
      ({ name }) => !assignedPermissionKeys.has(name)
    );
    setOptions(newOptions || []);
  }, [allPermissionsPayload]);

  useEffect(getPermissions, []);
  const handleDeletePermission = (permissions) => () => {
    removePermissions({ permissions: [permissions] });
  };
  const handlePermissionsDialog = () => {
    setPermissionDialogState(true);
    getAllPermissions();
  };
  const handleAddPermissions = (event) => {
    event.preventDefault();
    const permissions = value.map(({ name }) => name);
    addPermissions({ permissions }, `${role}/permissions`);
  };
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
          {role}
        </Typography>
      </Box>
      <form onSubmit={roleForm.handleSubmit}>
        <Grid container spacing={1}>
          <Grid item xs>
            <TextField
              fullWidth
              size="small"
              // disabled={loading}
              variant="outlined"
              name="name"
              label="Permission"
              value={roleForm.values.name}
              onChange={roleForm.handleChange}
              error={roleForm.touched.name && Boolean(roleForm.errors.name)}
              helperText={roleForm.touched.name && roleForm.errors.name}
            />
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              size="small"
              // disabled={loading}
              variant="outlined"
              name="description"
              label="description"
              value={roleForm.values.description}
              onChange={roleForm.handleChange}
              error={
                roleForm.touched.description && Boolean(roleForm.errors.description)
              }
              helperText={
                roleForm.touched.description && roleForm.errors.description
              }
            />
          </Grid>
          <Grid item xs="auto">
            <Button
              type="submit"
              // disabled={loading}
              endIcon={<SaveIcon />}
              variant="outlined"
            >
              Save
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
          Add Permissions to this Role
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handlePermissionsDialog}
        >
          Add Permissions
        </Button>
      </Box>
      <Typography paragraph>
        Users who have this Role will receive all Permissions below that match the
        API of their login request.
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
            {removingPermisisons ? (
              <TableRow>
                <TableCell padding="none" colSpan={3}>
                  <LinearProgress />
                </TableCell>
              </TableRow>
            ) : null}
            {permissionsPayload &&
              permissionsPayload.role.permissions.map((row) => (
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
      <SubmitModal
        title="Add Permissions"
        open={permissionDialogOpen}
        submitLabel="Add"
        onLoading={addingPermissions}
        onSubmit={handleAddPermissions}
        onClose={() => setPermissionDialogState(false)}
      >
        <Autocomplete
          multiple
          fullWidth
          id="checkboxes-tags-permissions"
          options={options}
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          disableCloseOnSelect
          getOptionLabel={(option) => option.name}
          renderOption={(option, { selected }) => (
            <>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.name}
            </>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Permissions"
              placeholder="permission"
            />
          )}
        />
      </SubmitModal>
    </Container>
  );
};

export default RoleDetailsView;
