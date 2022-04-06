import React from 'react';
import { Box, LinearProgress, Typography } from '@material-ui/core';
import { PropTypes } from 'prop-types';

const LinearProgressWithLabel = ({ value }) => {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" value={value} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
};

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};
export default LinearProgressWithLabel;
