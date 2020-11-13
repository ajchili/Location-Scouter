import React, { Component } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/auth';

export class Login extends Component {
  async login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await firebase.auth().signInWithPopup(provider);
      window.location.replace('/');
    } catch (error) {
      const { code, message } = error;
      console.error(code, message);
      alert(
        'There was an unexpected error when attempting to login. Please email contact@kirinpatel.com for assistance.'
      );
    }
  }

  render() {
    return (
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          height: '100vh',
        }}
      >
        <Grid item>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Grid item>
              <Typography
                variant="h2"
                gutterBottom
                style={{ color: '#FFFFFF' }}
              >
                Location Scouter
              </Typography>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <Grid item>
                  <Button variant="contained" onClick={this.login}>
                    Login
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
