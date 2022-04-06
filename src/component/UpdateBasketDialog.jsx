import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles,
  FormControl,
  Paper,
  Typography,
  Chip,
  Button,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import { AttachFile } from '@material-ui/icons';
import { useDropzone } from 'react-dropzone';
import { useSend } from '../api';
import LinearProgressWithLabel from './linearProgress';
import VersionsTable from './VersionTable';

const useStyles = makeStyles(() => ({
  dropStyle: {
    height: 250,
    outline: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '1rem 0',
    padding: '1rem',
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

const UpdateBasketDialog = ({ openDialog, setOpenDialog, basket }) => {
  const classes = useStyles();
  const [selectedView, onSelectedView] = useState(null);
  const [semanticVersion, setSemanticVersion] = useState('patch');
  const [file, setFile] = useState();
  const { send, progress, payload, setPayload, setProgress } = useSend(
    'software_versions'
  );
  const onDrop = useCallback(([acceptedFile]) => setFile(acceptedFile), []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ['.bin', '.hex'],
    maxFiles: 1,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('update_type', semanticVersion);
    formData.append('file', file);
    formData.append('basket_id', basket);
    send(formData);
    setFile(null);
  };

  const handleClose = () => {
    setFile(null);
    setProgress(null);
    setOpenDialog(false);
    setTimeout(() => {
      onSelectedView(false);
      setPayload(null);
    }, 500);
  };

  const handleVersion = (event) => {
    setSemanticVersion(event.target.value);
  };

  const renderUploadView = () => {
    return (
      <form onSubmit={handleSubmit}>
        <DialogTitle>Update Software</DialogTitle>
        {!payload ? (
          <DialogContent>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Version Number</FormLabel>
              <RadioGroup
                className={classes.radioGroup}
                aria-label="version number"
                name="version"
                value={semanticVersion}
                onChange={handleVersion}
              >
                <FormControlLabel value="major" control={<Radio />} label="Major" />
                <FormControlLabel value="minor" control={<Radio />} label="Minor" />
                <FormControlLabel value="patch" control={<Radio />} label="Patch" />
              </RadioGroup>
            </FormControl>
            <Paper
              className={classes.dropStyle}
              variant="outlined"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <Typography color="textSecondary" align="center" variant="h5">
                {isDragActive
                  ? 'Drop the file here...'
                  : 'Drag the file here, or click to select the file'}
              </Typography>
            </Paper>
            {file && (
              <Chip
                label={file.name}
                variant="outlined"
                color="primary"
                onDelete={() => setFile(null)}
                icon={<AttachFile />}
              />
            )}
            {progress ? <LinearProgressWithLabel value={progress} /> : null}
          </DialogContent>
        ) : (
          <DialogContent>
            <Typography variant="h6" align="center" color="textSecondary">
              The binary file is uploaded in our server, you can upload the basket
              now
            </Typography>
          </DialogContent>
        )}
        <DialogActions>
          <Button
            variant="outlined"
            size="large"
            color="primary"
            onClick={handleClose}
          >
            Cancel
          </Button>
          {file && (
            <Button type="submit" size="large" color="primary">
              Upload File
            </Button>
          )}
          {payload && (
            <Button type="submit" variant="outlined" size="large" color="primary">
              update basket now
            </Button>
          )}
        </DialogActions>
      </form>
    );
  };

  const renderShowView = () => {
    return (
      <form onSubmit={handleSubmit}>
        <DialogTitle>Update Software</DialogTitle>
        <DialogContent>
          <VersionsTable basketId={basket} />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            size="large"
            color="primary"
            onClick={handleClose}
          >
            Cancel
          </Button>
          {file && (
            <Button type="submit" size="large" color="primary">
              Upload File
            </Button>
          )}
        </DialogActions>
      </form>
    );
  };

  const renderView = () => {
    return (
      <>
        <DialogTitle>Basket</DialogTitle>
        <List>
          <ListItem autoFocus button onClick={() => onSelectedView('update')}>
            <ListItemText primary="Add new version" />
          </ListItem>
          <ListItem button onClick={() => onSelectedView('show')}>
            <ListItemText primary="Show all versions" />
          </ListItem>
        </List>
      </>
    );
  };

  const renderSelectedView = () => {
    switch (selectedView) {
      case 'update':
        return renderUploadView();
      case 'show':
        return renderShowView();
      default:
        return renderView;
    }
  };

  return (
    <Dialog open={openDialog} fullWidth>
      {selectedView ? renderSelectedView() : renderView()}
    </Dialog>
  );
};

UpdateBasketDialog.propTypes = {
  openDialog: PropTypes.bool.isRequired,
  setOpenDialog: PropTypes.func.isRequired,
  basket: PropTypes.number.isRequired,
};

export default UpdateBasketDialog;
