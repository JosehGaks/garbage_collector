import {
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

const MenuLink = ({ label, icon: Icon, children, drawerOpen }) => {
  const [open, setOpen] = useState(false);
  return (
    <List component="div" disablePadding>
      {drawerOpen && (
        <ListItem button onClick={() => setOpen(!open)}>
          <ListItemIcon>
            <Icon />
          </ListItemIcon>
          <ListItemText primary={label} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
      )}
      <Collapse in={open || !drawerOpen} timeout="auto">
        <List component="div" disablePadding>
          {children}
        </List>
      </Collapse>
    </List>
  );
};
MenuLink.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  icon: PropTypes.object.isRequired,
  drawerOpen: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
};
export default MenuLink;
