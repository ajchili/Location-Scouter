import React, { Component } from "react";
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import firebase from "../../firebase";

class Navbar extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { accountMenuEl: null };
  }

  _handleMenu = (event: any) => {
    this.setState({ accountMenuEl: event.currentTarget });
  };

  _handleClose = () => {
    this.setState({ accountMenuEl: null });
  };

  _logout = () => {
    this._handleClose();
    firebase.auth().signOut();
  };

  render() {
    const { accountMenuEl } = this.state;
    const open = Boolean(accountMenuEl);

    return (
      <AppBar position="fixed" color="default">
        <Toolbar>
          <Typography variant="h6" color="inherit" style={styles.grow}>
            Location Scouter
          </Typography>
          <IconButton
            aria-owns={open ? "menu-appbar" : undefined}
            aria-haspopup="true"
            onClick={this._handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={accountMenuEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            open={open}
            onClose={this._handleClose}
          >
            <MenuItem onClick={this._logout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    );
  }
}

const styles: any = {
  grow: {
    flexGrow: 1
  }
};

export default Navbar;