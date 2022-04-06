import React from 'react';
import {
  Typography,
  IconButton,
  MenuItem,
  Menu,
  Divider,
  ListItemIcon,
  Box,
} from '@material-ui/core';
import {
  Dashboard as DashBoardIcon,
  Settings as SettingsIcon,
  Map as MapIcon,
  ExitToApp as ExitToAppIcon,
  AccountCircle,
} from '@material-ui/icons';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import RBAC from '../../../component/RBAC';
import permissions from '../../../permissions';

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { logOut, user } = useAuth();
  const history = useHistory();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    logOut();
    handleClose();
    history.replace('/');
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="show user menu"
        aria-controls="user-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        getContentAnchorEl={undefined}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Box p={2}>
          <Typography>
            {user?.first_name} {user?.last_name}
          </Typography>
          <Typography color="textSecondary">{user?.email}</Typography>
        </Box>
        <Divider />
        <RBAC appRoles={permissions}>
          <MenuItem component={RouterLink} to="/dashboard">
            <ListItemIcon>
              <DashBoardIcon />
            </ListItemIcon>
            <Typography>Dashboard</Typography>
          </MenuItem>
        </RBAC>
        <MenuItem component={RouterLink} to="/">
          <ListItemIcon>
            <MapIcon />
          </ListItemIcon>
          <Typography>Map</Typography>
        </MenuItem>
        <MenuItem component={RouterLink} to="/profile">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <Typography>Account Setting</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogOut}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <Typography>LogOut</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
export default UserMenu;
