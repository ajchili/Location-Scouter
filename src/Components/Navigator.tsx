import React, { Component } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import firebase from 'firebase';
import { Loading as LoadingPage } from '../Pages';

export interface Props {}

export interface State {
  initialAuthCheckCompleted: boolean;
  user: firebase.User | null;
}

export class Navigator extends Component<Props, State> {
  private unsubscribe?: firebase.Unsubscribe;

  constructor(props: Props) {
    super(props);
    this.state = {
      initialAuthCheckCompleted: false,
      user: null,
    };
    this.unsubscribe = firebase
      .auth()
      .onAuthStateChanged((user: firebase.User | null) => {
        const { initialAuthCheckCompleted } = this.state;
        let newState: any = { user };
        if (initialAuthCheckCompleted === false) {
          newState.initialAuthCheckCompleted = true;
        }
        this.setState(newState);
      });
  }

  componentWillUnmount() {
    if (this.unsubscribe !== undefined) {
      this.unsubscribe();
    }
  }

  render() {
    const { initialAuthCheckCompleted } = this.state;

    return initialAuthCheckCompleted ? (
      <Router>
        <Switch></Switch>
      </Router>
    ) : (
      <LoadingPage />
    );
  }
}
