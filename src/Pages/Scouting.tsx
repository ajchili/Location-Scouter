import React, { Component } from 'react';
import { AppBar, Button, Grid, Toolbar, Typography } from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { ClickEventValue } from 'google-map-react';
import { Map } from '../Components';

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

  componentDidMount() {
    this.loadLocations();
  }

  get GoogleMapsAPIKey(): string {
    return process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
  }

  addLocation = async (event: ClickEventValue): Promise<void> => {
    const { uid } = firebase.auth().currentUser!;
    const { lat, lng } = event;
    const doc = await firebase.firestore().collection('locations').add({
      owner: uid,
      lat,
      lng,
    });
    const { locations } = this.state;
    this.setState({ locations: [{ id: doc.id, lat, lng }].concat(locations) });
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
          lat: doc.data().lat,
          lng: doc.data().lng,
        };
      }),
    });
  }

  logout(): void {
    firebase.auth().signOut();
  }

  render() {
    const { locations } = this.state;
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
              <Map locations={locations} onClick={this.addLocation} />
            </Grid>
            <Grid item xs={3}>
              {locations.map((location) => (
                <Typography key={location.id}>{location.id}</Typography>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
