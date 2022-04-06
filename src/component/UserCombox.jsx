import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { useGet } from '../api';

function UserCombox({ setUser }) {
  const [inputValue, setInputValue] = React.useState('');
  const { payload: options, getAll: getUsers } = useGet(
    inputValue ? `/users?search=${inputValue}` : '/users'
  );

  React.useEffect(() => {
    if (inputValue !== '') {
      getUsers();
    }
  }, [inputValue]);

  return (
    <Autocomplete
      id="google-map-demo"
      style={{ width: '100%' }}
      filterOptions={(x) => x}
      options={options?.user || []}
      autoComplete
      includeInputInList
      filterSelectedOptions
      getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(event, newValue) => setUser(newValue)}
      renderInput={(params) => (
        <TextField {...params} label="User" variant="outlined" fullWidth />
      )}
      renderOption={(option) => {
        return (
          <Grid container alignItems="center">
            <Grid item xs>
              <Typography>
                {option.first_name} {option.last_name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {option.email}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}
UserCombox.propTypes = {
  setUser: PropTypes.func.isRequired,
};
export default UserCombox;
