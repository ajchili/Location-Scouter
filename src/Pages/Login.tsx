import React, { Component } from 'react';
import firebase from 'firebase';

export class Login extends Component {
  async login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      const { code, credential, email, message } = error;
      // TODO: Display error
      console.error(code, message);
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.login}>Login</button>
      </div>
    );
  }
}
