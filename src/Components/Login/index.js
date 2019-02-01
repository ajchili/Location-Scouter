import React, { Component } from "react";
import firebase, { provider } from "../../firebase";
import { Button, Card, Typography } from "@material-ui/core";

class Login extends Component {
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
      <Card className="centered" style={styles.card}>
        <div style={styles.cardContent}>
          <Typography variant="h5" component="h2" gutterBottom>
            Location Scouter
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

const styles = {
  card: {
    width: "25%"
  },
  cardContent: {
    padding: 5
  }
};

export default Login;
