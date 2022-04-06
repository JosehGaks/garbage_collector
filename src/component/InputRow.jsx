import { Grid, IconButton, InputAdornment, TextField } from '@material-ui/core';
import { Add, Close } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React from 'react';

const InputRow = ({ rowItems, onAdd, onRemove, onInput, lastItem }) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm>
        <TextField
          fullWidth
          name="section"
          label="Section"
          variant="outlined"
          value={rowItems.section}
          onInput={onInput}
        />
      </Grid>
      <Grid item xs={12} sm>
        <TextField
          fullWidth
          name="section_height"
          label="Height"
          variant="outlined"
          type="number"
          value={rowItems.section_height}
          onInput={onInput}
          InputProps={{
            endAdornment: <InputAdornment position="end">cm</InputAdornment>,
          }}
        />
      </Grid>
      <Grid item xs={12} sm>
        <TextField
          fullWidth
          name="section_length"
          label="length"
          variant="outlined"
          type="number"
          value={rowItems.section_length}
          onInput={onInput}
          InputProps={{
            endAdornment: <InputAdornment position="end">cm</InputAdornment>,
          }}
        />
      </Grid>
      <Grid item xs={12} sm>
        <TextField
          fullWidth
          name="section_width"
          label="width"
          variant="outlined"
          type="number"
          value={rowItems.section_width}
          onInput={onInput}
          InputProps={{
            endAdornment: <InputAdornment position="end">cm</InputAdornment>,
          }}
        />
      </Grid>
      <Grid item sm="auto">
        {lastItem ? (
          <IconButton onClick={onAdd}>
            <Add />
          </IconButton>
        ) : (
          <IconButton onClick={onRemove}>
            <Close />
          </IconButton>
        )}
      </Grid>
    </Grid>
  );
};

InputRow.propTypes = {
  rowItems: PropTypes.shape({
    id: PropTypes.number,
    section: PropTypes.string,
    section_height: PropTypes.number,
    section_length: PropTypes.number,
    section_width: PropTypes.number,
  }).isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onInput: PropTypes.func.isRequired,
  lastItem: PropTypes.bool.isRequired,
};

export default InputRow;
