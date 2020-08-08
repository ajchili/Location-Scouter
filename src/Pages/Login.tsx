import React, { Component } from 'react';
import firebase from 'firebase';
import { Button, Flex } from '@chakra-ui/core';

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
      <Flex
        align="center"
        direction="column"
        justifyContent="center"
        w="100%"
        h="100vh"
      >
        <Button onClick={this.login}>Sign in with Google</Button>
      </Flex>
    );
  }
}
