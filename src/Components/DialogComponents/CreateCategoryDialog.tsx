import React, {Component} from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography
} from "@material-ui/core";

class CreateCategoryDialog extends Component<any, any> {
  constructor(props: {
    open: boolean,
    onClose: () => void,
    onCreate: (name: string) => void
  }) {
    super(props);
    this.state = {name: "", error: ""};
  }

  _onCategoryNameChange = (e: any) => {
    const {error} = this.state;
    this.setState({
      name: e.target.value,
      error: !!error && e.target.value.length ? "" : error
    });
  };

  _onClose = () => {
    const {onClose} = this.props;
    if (onClose) onClose();
    this.setState({name: ""});
  };

  _create = () => {
    const {onCreate} = this.props;
    const {name} = this.state;
    console.log(!!onCreate);
    if (onCreate) {
      if (name.length) {
        onCreate(name);
        this.setState({name: "", error: ""});
      } else {
        this.setState({error: "A name is required to create a category"});
      }
    }
  };

  render() {
    const {name, error} = this.state;
    const {open} = this.props;

    return (
      <Dialog open={open} onClose={this._onClose}>
        <DialogTitle>Create New Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A category holds locations in a group to help you better manage long
            lists of locations. Categories can have infinite locations and be
            named, color, and shared with others.
          </DialogContentText>
          <Typography color="error">{error}</Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            value={name}
            onChange={this._onCategoryNameChange}
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this._create}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default CreateCategoryDialog;