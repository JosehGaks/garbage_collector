import { Container, Link, Typography } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

import React from 'react';

const NotFoundView = () => {
  return (
    <Container>
      <Typography variant="h1">404: Page Not Found</Typography>
      <Link component={RouterLink} to="/">
        go to home
      </Link>
    </Container>
  );
};
export default NotFoundView;
