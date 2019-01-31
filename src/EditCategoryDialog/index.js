import React, { Component } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@material-ui/core";
import CategoryIcon from "@material-ui/icons/Category";
import LocationIcon from "@material-ui/icons/PinDrop";
import Proptypes from "prop-types";

class EditCategoryDialog extends Component {
  state = {
    name: ""
  };

  componentDidMount() {
    const { category } = this.props;
    this.setState({ ...category });
  }

  _onClose = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  _handleListItemClicked = value => {
    const { onClose } = this.props;
    if (onClose) onClose(value);
  };

  _onNameChanged = e => {
    this.setState({ name: e.target.value });
  };

  _save = () => {
    const { onClose } = this.props;
    if (onClose) onClose(this.state);
  };

  _delete = () => {
    const { onClose } = this.props;
    if (onClose) onClose("delete");
  };

  render() {
    const { name } = this.state;
    const { category, onClose, ...other } = this.props;

    return (
      <Dialog onClose={this._onClose} {...other}>
        <DialogTitle>Edit "{category.name}"</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            value={name}
            onChange={this._onNameChanged}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={this._delete}>
            Delete
          </Button>
          <Button color="primary" onClick={this._onClose}>
            Close
          </Button>
          <Button color="primary" onClick={this._save}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

EditCategoryDialog.propTypes = {
  category: Proptypes.object.isRequired,
  onClose: Proptypes.func
};

export default EditCategoryDialog;
