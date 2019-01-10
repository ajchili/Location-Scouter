import React, { Component } from "react";
import firebase, { provider } from "../firebase";
import { Button, Card, Typography } from "@material-ui/core";
import "./Login.css";

export default class extends Component {
  state = {
    error: null
  };

  _login = () => {
    this.setState({ error: null });
    firebase
      .auth()
      .signInWithPopup(provider)
      .catch(error => this.setState({ error }));
  };

  render() {
    const { error } = this.state;
    return (
      <Card className="centered card">
        <div>
          <Typography variant="h5" component="h2" gutterBottom>
            Login
          </Typography>
          {error && (
            <Typography variant="caption" color="error" gutterBottom>
              {error.message}
            </Typography>
          )}
          <Button variant="outlined" onClick={this._login}>
            Login with Google
          </Button>
        </div>
      </Card>
    );
  }
}
