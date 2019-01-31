import React, { Component } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";

class CreateLocationHereDialog extends Component {
  _onClose = () => {
    this.props.onClose();
  }

  render() {
    const { onClose, ...other } = this.props;

    return (
      <Dialog onClose={this._onClose} {...other}>
        <DialogTitle>Would you like to create a new location here?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A pin will be added to the location you just clicked. It can be
            edited or delete at any time if you create it now.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary">No</Button>
          <Button color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default CreateLocationHereDialog;
