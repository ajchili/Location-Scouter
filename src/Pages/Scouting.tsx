import React, { Component } from 'react';
import { Flex, Text } from '@chakra-ui/core';
import GoogleMapReact from 'google-map-react';

export interface Props {}

export interface State {
  locations: any[];
}

export class Scouting extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      locations: [],
    };
  }

  get GoogleMapsAPIKey(): string {
    return process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
  }

  render() {
    return (
      <Flex direction="column" w="100%" h="100vh">
        <Flex direction="row" w="100%" h="100%">
          <Flex direction="column" w="75%" h="100%">
            <GoogleMapReact
              bootstrapURLKeys={{ key: this.GoogleMapsAPIKey }}
              defaultCenter={{
                lat: 0,
                lng: 0,
              }}
              defaultZoom={0}
              yesIWantToUseGoogleMapApiInternals
              onClick={(e) => {
                this.setState({
                  locations: [e].concat(...this.state.locations),
                });
              }}
            />
          </Flex>
          <Flex direction="column" w="25%" maxW="25%" h="100%">
            <Text>Location Scouter</Text>
            {this.state.locations.map((location) => {
              return (
                <Text w="100%" maxW="100%">
                  {JSON.stringify(location)}
                </Text>
              );
            })}
          </Flex>
        </Flex>
      </Flex>
    );
  }
}
