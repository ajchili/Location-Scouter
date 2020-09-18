import React, { Component } from 'react';
import {
  AppBar as MaterialAppBar,
  Button,
  Toolbar,
  Typography,
} from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import * as H from 'history';

export interface Props {
  history: H.History;
  page: 'Scouting' | 'Settings';
}

export class AppBar extends Component<Props> {
  goTo(page: string) {
    const { history } = this.props;
    history.push(page.toLowerCase());
  }

  logout(): void {
    firebase.auth().signOut();
  }

  render() {
    const { page } = this.props;

    return (
      <MaterialAppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Location Scouter
          </Typography>
          <Button
            color="inherit"
            disabled={page === 'Scouting'}
            onClick={() => this.goTo('/')}
          >
            Scout
          </Button>
          <Button
            color="inherit"
            disabled={page === 'Settings'}
            onClick={() => this.goTo('/Settings')}
          >
            Settings
          </Button>
          <Button color="inherit" onClick={this.logout}>
            Logout
          </Button>
        </Toolbar>
      </MaterialAppBar>
    );
  }
}
