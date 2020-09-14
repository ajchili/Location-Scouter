import React, { Component } from 'react';
import {
  AppBar,
  Button,
  Grid,
  List,
  Toolbar,
  Typography,
} from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { ClickEventValue, Coords } from 'google-map-react';
import { CreateMapElement, Map, MapElementListItem } from '../Components';

export interface Props {}

export interface State {
  center?: Coords;
  createMapElement?: Coords;
  locations: any[];
}

export class Scouting extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      locations: [],
    };
  }

  componentDidMount() {
    this.loadLocations();
  }

  createElement = (event: ClickEventValue): void => {
    const { createMapElement } = this.state;
    if (createMapElement !== undefined) {
      return;
    }
    const { lat, lng } = event;
    const coords = { lat, lng };
    this.setState({ center: coords, createMapElement: coords });
  };

  addLocation = async (name: string): Promise<void> => {
    const { createMapElement } = this.state;
    if (createMapElement === undefined) {
      return;
    }
    const { uid } = firebase.auth().currentUser!;
    const { lat, lng } = createMapElement;
    const data = {
      lat,
      lng,
      name,
      owner: uid,
    };
    const doc = await firebase.firestore().collection('locations').add(data);
    const { locations } = this.state;
    this.setState({
      center: undefined,
      createMapElement: undefined,
      locations: [{ id: doc.id, ...data }].concat(locations),
    });
  };

  deleteLocation = async (id: string): Promise<void> => {
    const location = this.state.locations.find(
      (location) => location.id === id
    );
    if (
      location === null ||
      !window.confirm(
        `Are you sure that you want to delete "${
          location.name || 'Unknown Location'
        }"?`
      )
    ) {
      return;
    }
    await firebase.firestore().collection('locations').doc(id).delete();
    this.setState((previousState) => {
      return {
        locations: previousState.locations.filter(
          (location) => location.id !== id
        ),
      };
    });
  };

  async loadLocations(): Promise<void> {
    const { uid } = firebase.auth().currentUser!;
    const query = await firebase
      .firestore()
      .collection('locations')
      .where('owner', '==', uid)
      .get();
    this.setState({
      locations: query.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      }),
    });
  }

  logout(): void {
    firebase.auth().signOut();
  }

  render() {
    const { center, createMapElement, locations } = this.state;
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          flexFlow: 'column',
          height: '100vh',
        }}
      >
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Location Scouter
            </Typography>
            <Button color="inherit" onClick={this.logout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <div
          style={{
            display: 'flex',
            flexWrap: 'nowrap',
            flexFlow: 'row',
            height: '100%',
            overflow: 'auto',
          }}
        >
          <Map
            center={center}
            locations={locations}
            onClick={this.createElement}
            onCenterUpdated={() => {
              if (
                this.state.center !== undefined &&
                this.state.createMapElement === undefined
              ) {
                this.setState({ center: undefined });
              }
            }}
            children={
              createMapElement && (
                <CreateMapElement
                  lat={createMapElement.lat}
                  lng={createMapElement.lng}
                  onCancel={() => {
                    this.setState({
                      center: undefined,
                      createMapElement: undefined,
                    });
                  }}
                  onCreate={this.addLocation}
                />
              )
            }
          />
          <div
            style={{
              height: '100%',
              maxHeight: '100%',
              overflowY: 'scroll',
              width: '25%',
            }}
          >
            <List>
              {locations
                .sort((a, b) => {
                  const name1 = a.name || 'Unnamed Element';
                  const name2 = b.name || 'Unnamed Element';
                  if (name1 > name2) {
                    return 1;
                  } else if (name2 > name1) {
                    return -1;
                  }
                  return 0;
                })
                .map((location) => (
                  <MapElementListItem
                    key={location.id}
                    mapElement={{
                      id: location.id,
                      name: location.name || 'Unnamed Element',
                      lat: location.lat,
                      lng: location.lng,
                    }}
                    onClick={() =>
                      this.setState({
                        center: { lat: location.lat, lng: location.lng },
                      })
                    }
                    onDelete={this.deleteLocation}
                  />
                ))}
            </List>
          </div>
        </div>
      </div>
    );
  }
}
