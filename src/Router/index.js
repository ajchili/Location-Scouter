import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import firebase from "../firebase";
import { CircularProgress, Typography } from "@material-ui/core";
import Login from "../Login";
import Navbar from "../Navbar";
import Map from "../Map";
import "./Router.css";

export default class extends Component {
  state = {
    hasLoaded: false,
    authenticated: false
  };

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
                  <div className="content">
                    <Route exact path="/" component={Map} />
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
