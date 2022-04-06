import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  ListItemIcon,
  Divider,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import Icons from '../../../hooks/Icons';

const CollapseMenu = ({ drawerOpen, items }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  return (
    <>
      <>
        {drawerOpen && items.subMenu && (
          <ListItem onClick={handleOpen} button>
            <ListItemIcon>{Icons(items.icons)}</ListItemIcon>
            <ListItemText primary={items.label} />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
        )}
        {!items.subMenu && (
          <ListItem button component={Link} to={items.link}>
            <ListItemIcon>{Icons(items.icons)}</ListItemIcon>
            <ListItemText primary={items.label} />
          </ListItem>
        )}
      </>
      {items.subMenu && (
        <Collapse in={open || !drawerOpen} timeout="auto">
          <List component="div" disablePadding>
            {items.subMenu.map(
              ({ key: itemKey, label: itemLabel, icons: subIcons, link }) => (
                <ListItem button component={Link} key={itemKey} to={link}>
                  <ListItemIcon>{Icons(subIcons)}</ListItemIcon>
                  <ListItemText secondary={itemLabel} />
                </ListItem>
              )
            )}
          </List>
        </Collapse>
      )}
      {drawerOpen && <Divider />}
    </>
  );
};
CollapseMenu.propTypes = {
  items: PropTypes.objectOf(PropTypes.any).isRequired,
  drawerOpen: PropTypes.bool.isRequired,
};
export default CollapseMenu;
