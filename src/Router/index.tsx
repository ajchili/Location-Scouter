import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { CircularProgress, Typography } from "@material-ui/core";
import firebase from "../firebase";
import Login from "../Login";
import Navbar from "../Navbar";
import Locations from "../Locations";

export default class extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      hasLoaded: false,
      authenticated: false
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      const { hasLoaded } = this.state;
      if (!hasLoaded) this.setState({ hasLoaded: true });
      this.setState({ authenticated: !!user });
    });
  }

  render() {
    const { hasLoaded, authenticated } = this.state;

    return (
      <div className="full">
        {hasLoaded ? (
          <div>
            {authenticated ? (
              <Router>
                <div>
                  <Navbar />
                  <div style={{ paddingTop: 64 }}>
                    <Route exact path="/" component={Locations} />
                  </div>
                </div>
              </Router>
            ) : (
              <Login className="centered" />
            )}
          </div>
        ) : (
          <div className="centered">
            <CircularProgress />
            <Typography variant="h6">Loading</Typography>
          </div>
        )}
      </div>
    );
  }
}
