import React, { Component } from "react";
import {
  Avatar,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from "@material-ui/core";
import CategoryIcon from "@material-ui/icons/Category";
import LocationIcon from "@material-ui/icons/LocationOn";
import Proptypes from "prop-types";

class CreateNewDialog extends Component {
  _onClose = () => {
    this.props.onClose();
  };

  _handleListItemClicked = value => {
    this.props.onClose(value);
  };

  render() {
    const { onClose, ...other } = this.props;

    return (
      <Dialog onClose={this._onClose} {...other}>
        <DialogTitle>Create New...</DialogTitle>
        <List>
          <ListItem
            button
            onClick={() => this._handleListItemClicked("category")}
          >
            <ListItemAvatar>
              <Avatar>
                <CategoryIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={"Category"} />
          </ListItem>
          <ListItem
            button
            onClick={() => this._handleListItemClicked("location")}
          >
            <ListItemAvatar>
              <Avatar>
                <LocationIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={"Location"} />
          </ListItem>
        </List>
      </Dialog>
    );
  }
}

CreateNewDialog.propTypes = {
  onClose: Proptypes.func
};

export default CreateNewDialog;
