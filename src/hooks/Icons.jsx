import React from 'react';
import * as icons from '@material-ui/icons';

const Icons = (name) => {
  const Icon = icons[name];
  return <Icon />;
};

export default Icons;
