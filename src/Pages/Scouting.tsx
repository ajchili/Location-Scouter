import React, { Component } from 'react';
import { AppBar, Button, Grid, Toolbar, Typography } from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { ClickEventValue, Coords } from 'google-map-react';
import { CreateMapElement, Map } from '../Components';
import { create } from 'domain';

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
      <Grid
        container
        direction="column"
        style={{ display: 'flex', height: '100%' }}
      >
        <Grid item>
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
        </Grid>
        <Grid item style={{ flex: 1 }}>
          <Grid
            container
            direction="row"
            style={{ maxWidth: '100%', height: '100%' }}
          >
            <Grid item xs={9}>
              <Map
                center={center}
                locations={locations}
                onClick={this.createElement}
                onCenterUpdated={() => {
                  if (center !== undefined && createMapElement === undefined) {
                    this.setState({ center: undefined });
                  }
                }}
                children={
                  createMapElement && (
                    <CreateMapElement
                      lat={createMapElement.lat}
                      lng={createMapElement.lng}
                      onCancel={() => {
                        this.setState({ createMapElement: undefined });
                      }}
                      onCreate={this.addLocation}
                    />
                  )
                }
              />
            </Grid>
            <Grid item xs={3}>
              {locations.map((location) => (
                <Typography
                  key={location.id}
                  onClick={() =>
                    this.setState({
                      center: { lat: location.lat, lng: location.lng },
                    })
                  }
                >
                  {location.name || location.id}
                </Typography>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
