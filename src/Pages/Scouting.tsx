import React, { Component } from 'react';
import { AppBar, Button, Grid, Toolbar, Typography } from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/auth';
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

  logout(): void {
    firebase.auth().signOut();
  }

  render() {
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
              <GoogleMapReact
                bootstrapURLKeys={{ key: this.GoogleMapsAPIKey }}
                defaultCenter={{
                  lat: parseFloat(window.localStorage.getItem('mapLat') || '0'),
                  lng: parseFloat(window.localStorage.getItem('mapLng') || '0'),
                }}
                defaultZoom={parseInt(
                  window.localStorage.getItem('mapDefaultZoom') || '0',
                  10
                )}
                yesIWantToUseGoogleMapApiInternals
                onClick={(e) => {
                  this.setState({
                    locations: [e].concat(...this.state.locations),
                  });
                }}
                onMapTypeIdChange={(mapTypeId) =>
                  window.localStorage.setItem('mapTypeId', mapTypeId)
                }
                onDrag={(map: any) => {
                  const { center } = map;
                  window.localStorage.setItem('mapLat', center.lat());
                  window.localStorage.setItem('mapLng', center.lng());
                }}
                onZoomAnimationEnd={(zoom) =>
                  window.localStorage.setItem('mapDefaultZoom', zoom)
                }
                options={{
                  mapTypeId:
                    window.localStorage.getItem('mapTypeId') || 'hybrid',
                  mapTypeControl: true,
                  streetViewControl: true,
                }}
              />
            </Grid>
            <Grid item xs={3}></Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
