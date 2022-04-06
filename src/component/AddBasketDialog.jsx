import React from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles,
  Dialog,
  DialogContent,
  Button,
  DialogTitle,
  TextField,
  DialogActions,
  CircularProgress,
  Grid,
} from '@material-ui/core';
import { useCreate } from '../api';
import InputRow from './InputRow';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },

  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

const AddBasketDialog = ({ setOpenDialog, openDialog, coordinates, onSuccess }) => {
  const classes = useStyles();
  const [inputRows, setInputRows] = React.useState([
    { id: 1, section: '', section_height: 0, section_length: 0, section_width: 0 },
  ]);
  const { payload: baskets, isPending, create, setPayload } = useCreate(
    '/baskets',
    onSuccess
  );

  const handleAddInputRow = () => {
    setInputRows((prevInput) => [
      ...prevInput,
      {
        id: prevInput.pop().id + 1,
        section: '',
        section_height: 0,
        section_length: 0,
        section_width: 0,
      },
    ]);
  };

  const handleRemoveInput = (index) => () => {
    const list = [...inputRows];
    list.splice(index, 1);
    setInputRows(list);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    create({
      longitude: coordinates?.lng,
      latitude: coordinates?.lat,
      micro_controller: 'nodeMCU',
      sections: inputRows,
    });
  };

  const closeHandler = () => {
    setOpenDialog(false);
    setTimeout(() => {
      setPayload(null);
    }, 100);
  };

  const handleChangeInput = (index) => ({ target }) => {
    const { name, value, type } = target;
    const list = [...inputRows];
    if (type === 'number') {
      list[index][name] = parseInt(value, 10);
    } else {
      list[index][name] = value;
    }
    setInputRows(list);
  };

  const renderResult = ({ id }) => {
    return (
      <Grid container justifyContent="center" alignItems="center" spacing={0}>
        <Grid item md={6}>
          <TextField
            fullWidth
            margin="dense"
            label="ID"
            variant="outlined"
            InputProps={{ readOnly: true }}
            defaultValue={id}
          />
        </Grid>
        <Grid item md={6}>
          <img
            src={`http://localhost:5000/api/quick_response_code/${id}`}
            alt={`basket no. ${id}`}
            style={{ width: '100%' }}
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <Dialog open={openDialog} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add Basket</DialogTitle>
        <DialogContent>
          {baskets
            ? renderResult(baskets.basket)
            : inputRows.map((rowItems, index) => (
                <InputRow
                  key={rowItems.id}
                  rowItems={rowItems}
                  onAdd={handleAddInputRow}
                  onRemove={handleRemoveInput(index)}
                  onInput={handleChangeInput(index)}
                  lastItem={inputRows.length - 1 === index}
                />
              ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeHandler}
            variant="outlined"
            size="large"
            color="primary"
          >
            Cancel
          </Button>
          {!baskets ? (
            <div className={classes.wrapper}>
              <Button
                type="submit"
                variant="outlined"
                size="large"
                color="primary"
                disabled={isPending}
              >
                Add
              </Button>
              {isPending && (
                <CircularProgress size={24} className={classes.buttonProgress} />
              )}
            </div>
          ) : null}
        </DialogActions>
      </form>
    </Dialog>
  );
};

AddBasketDialog.defaultProps = {
  coordinates: null,
};

AddBasketDialog.propTypes = {
  openDialog: PropTypes.bool.isRequired,
  setOpenDialog: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  coordinates: PropTypes.shape({ lat: PropTypes.number, lng: PropTypes.number }),
};

export default AddBasketDialog;
