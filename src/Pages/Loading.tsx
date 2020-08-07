import React, { Component } from 'react';
import { CircularProgress, Flex, Text } from '@chakra-ui/core';

export class Loading extends Component {
  render() {
    return (
      <Flex
        align="center"
        direction="column"
        justifyContent="center"
        w="100%"
        h="100vh"
      >
        <CircularProgress isIndeterminate></CircularProgress>
        <Text fontSize="xl">Loading Location Scouter</Text>
      </Flex>
    );
  }
}
