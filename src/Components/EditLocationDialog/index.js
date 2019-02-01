import React, { Component } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@material-ui/core";
import Proptypes from "prop-types";

class EditLocationDialog extends Component {
  state = {
    name: "",
    text: "",
    category: ""
  };

  componentDidMount() {
    const { location } = this.props;
    this.setState({ ...location });
  }

  _onClose = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  _onNameChanged = e => {
    this.setState({ name: e.target.value });
  };

  _onTextChanged = e => {
    this.setState({ text: e.target.value });
  };

  _onCategoryChange = e => {
    this.setState({ category: e.target.value });
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
    const { name, text, category } = this.state;
    const { location, categories, onClose, ...other } = this.props;

    return (
      <Dialog onClose={this._onClose} {...other}>
        <DialogTitle>Edit "{location.name}"</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Location Name"
            type="text"
            fullWidth
            value={name}
            onChange={this._onNameChanged}
          />
          <TextField
            margin="dense"
            label="Location Details"
            type="text"
            fullWidth
            value={text}
            onChange={this._onTextChanged}
          />
          <FormControl style={{ width: "100%" }}>
            <InputLabel>Category</InputLabel>
            <Select
              margin="dense"
              fullWidth
              value={category}
              onChange={this._onCategoryChange}
            >
              {categories.map(category => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

EditLocationDialog.propTypes = {
  categories: Proptypes.array.isRequired,
  location: Proptypes.object.isRequired,
  onClose: Proptypes.func
};

export default EditLocationDialog;
