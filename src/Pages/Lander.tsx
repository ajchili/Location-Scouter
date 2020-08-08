import React, { Component } from 'react';
import { Flex, Heading } from '@chakra-ui/core';

export class Lander extends Component {
  render() {
    return (
      <Flex
        align="center"
        direction="column"
        justifyContent="center"
        w="100%"
        h="100vh"
      >
        <Heading>Location Scouter</Heading>
        <a href="/login">Login</a>
      </Flex>
    );
  }
}
