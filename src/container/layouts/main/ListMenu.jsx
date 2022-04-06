import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import React from 'react';
import {
  Map,
  Home,
  Delete,
  Add,
  Edit,
  PeopleAlt,
  Security,
  Lock,
  SystemUpdateAlt,
} from '@material-ui/icons';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import MenuLink from './MenuLink';
import RBAC from '../../../component/RBAC';

const ListMenu = ({ drawerOpen }) => {
  return (
    <List>
      <ListItem button component={RouterLink} to="/dashboard">
        <ListItemIcon>
          <Home />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <Divider />
      <RBAC
        appRoles={[
          'basket:read',
          'basket:create',
          'basket:update',
          'basket:software-update',
        ]}
      >
        <MenuLink label="Basket Management" drawerOpen={drawerOpen} icon={Map}>
          <RBAC appRoles={['basket:read']}>
            <ListItem button component={RouterLink} to="/baskets/show">
              <ListItemIcon>
                <Delete />
              </ListItemIcon>
              <ListItemText secondary="Show Basket" />
            </ListItem>
          </RBAC>
          <RBAC appRoles={['basket:create']}>
            <ListItem button component={RouterLink} to="/baskets/add">
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText secondary="Add Basket" />
            </ListItem>
          </RBAC>
          <RBAC appRoles={['basket:update']}>
            <ListItem button component={RouterLink} to="/baskets/update">
              <ListItemIcon>
                <Edit />
              </ListItemIcon>
              <ListItemText secondary="Edit Basket" />
            </ListItem>
          </RBAC>
          <RBAC appRoles={['basket:software-update']}>
            <ListItem button component={RouterLink} to="/baskets/update-software">
              <ListItemIcon>
                <SystemUpdateAlt />
              </ListItemIcon>
              <ListItemText secondary="Update Software" />
            </ListItem>
          </RBAC>
        </MenuLink>
        <Divider />
      </RBAC>
      <RBAC appRoles={['users:read', 'roles:read', 'permissions:read']}>
        <MenuLink label="User Management" icon={PeopleAlt} drawerOpen={drawerOpen}>
          <RBAC appRoles={['users:read']}>
            <ListItem button component={RouterLink} to="/users/show">
              <ListItemIcon>
                <PeopleAlt />
              </ListItemIcon>
              <ListItemText secondary="User" />
            </ListItem>
          </RBAC>
          <RBAC appRoles={['roles:read']}>
            <ListItem button component={RouterLink} to="/roles">
              <ListItemIcon>
                <Security />
              </ListItemIcon>
              <ListItemText secondary="Roles" />
            </ListItem>
          </RBAC>
          <RBAC appRoles={['permissions:read']}>
            <ListItem button component={RouterLink} to="/permissions">
              <ListItemIcon>
                <Lock />
              </ListItemIcon>
              <ListItemText secondary="Permissions" />
            </ListItem>
          </RBAC>
        </MenuLink>
      </RBAC>
      <Divider />
    </List>
  );
};
ListMenu.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
};
export default ListMenu;
