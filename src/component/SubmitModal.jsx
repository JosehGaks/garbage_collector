import React from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  DialogTitle,
  DialogActions,
  Slide,
  LinearProgress,
} from '@material-ui/core';
import PropTypes from 'prop-types';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const SubmitModal = ({
  open,
  title,
  children,
  onSubmit,
  submitLabel,
  onClose,
  onLoading,
}) => {
  return (
    <Dialog TransitionComponent={Transition} open={open} maxWidth="md" fullWidth>
      <form onSubmit={onSubmit}>
        {onLoading && <LinearProgress />}
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" size="large" color="primary">
            Cancel
          </Button>
          <Button
            variant="outlined"
            size="large"
            color="primary"
            type="submit"
            disabled={onLoading}
          >
            {submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

SubmitModal.propTypes = {
  open: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onLoading: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  submitLabel: PropTypes.string.isRequired,
};

export default SubmitModal;
