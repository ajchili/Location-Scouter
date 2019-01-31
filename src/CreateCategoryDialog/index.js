import React, { Component } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from "@material-ui/core";

class CreateCategoryDialog extends Component {
  state = {
    categoryName: ""
  };

  _onCategoryNameChange = e => {
    this.setState({ categoryName: e.target.value });
  };

  _onClose = () => {
    const { onClose } = this.props;
    onClose();
    this.setState({ categoryName: ""});
  };

  _onCreate = () => {
    const { categoryName } = this.state;
    const { onClose } = this.props;
    onClose(categoryName);
    this.setState({ categoryName: ""});
  };

  render() {
    const { categoryName } = this.state;
    const { onClose, ...other } = this.props;

    return (
      <Dialog onClose={this._onClose} {...other}>
        <DialogTitle>Create New Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A category holds locations in a group to help you better manage long
            lists of locations. Categories can have infinite locations and be
            named, color, and shared with others.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            value={categoryName}
            onChange={this._onCategoryNameChange}
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this._onCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default CreateCategoryDialog;
