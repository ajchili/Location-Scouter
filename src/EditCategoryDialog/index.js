import React, { Component } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormLabel,
  TextField,
  Tooltip
} from "@material-ui/core";
import { TwitterPicker } from "react-color";
import Proptypes from "prop-types";

class EditCategoryDialog extends Component {
  state = {
    name: "",
    color: "#000000"
  };

  componentDidMount() {
    const { category } = this.props;
    this.setState({ ...category });
  }

  _onClose = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  _onNameChanged = e => {
    this.setState({ name: e.target.value });
  };

  _onColorChanged = color => {
    this.setState({ color: color.hex });
  };

  _save = () => {
    const { onClose } = this.props;
    if (onClose) onClose(this.state);
  };

  _delete = () => {
    const { onClose, category } = this.props;
    if (onClose) onClose(category.locations.length ? null : "delete");
  };

  render() {
    const { name, color } = this.state;
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
          <div style={{ paddingTop: 5, paddingBottom: 5 }}>
            <FormLabel>Category Color</FormLabel>
          </div>
          <TwitterPicker
            triangle="hide"
            color={color}
            onChangeComplete={this._onColorChanged}
          />
        </DialogContent>
        <DialogActions>
          <Tooltip
            title="Unable to delete categories that have locations."
            aria-label="Unable to delete categories that have locations."
          >
            <div>
              <Button
                color="secondary"
                onClick={this._delete}
                disabled={!!category.locations.length}
              >
                Delete
              </Button>
            </div>
          </Tooltip>
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
