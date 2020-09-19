import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { RouteComponentProps } from 'react-router-dom';
import {
  AppBar,
  CreateMapElement,
  LocationScoutingMap,
  MapElementList,
} from '../Components';
import { MapElement } from '../lib/types';
import { MappingService } from '../Services';

export interface Props extends RouteComponentProps {}

export interface State {
  selectedMapElement?: any;
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

  createElement = (coords: google.maps.LatLngLiteral): void => {
    // const { createMapElement } = this.state;
    // if (createMapElement !== undefined) {
    //   return;
    // }
  };

  addLocation = async (name: string): Promise<void> => {
    // const { createMapElement } = this.state;
    // if (createMapElement === undefined) {
    //   return;
    // }
    // const { uid } = firebase.auth().currentUser!;
    // const { lat, lng } = createMapElement;
    // const data = {
    //   lat,
    //   lng,
    //   name,
    //   owner: uid,
    // };
    // try {
    //   const doc = await firebase.firestore().collection('locations').add(data);
    //   const { locations } = this.state;
    //   this.setState({
    //     createMapElement: undefined,
    //     locations: [{ id: doc.id, ...data }].concat(locations),
    //   });
    // } catch (err) {
    //   // TODO
    // }
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
    try {
      await firebase.firestore().collection('locations').doc(id).delete();
      this.setState((previousState) => {
        return {
          locations: previousState.locations.filter(
            (location) => location.id !== id
          ),
        };
      });
    } catch (err) {
      // TODO
    }
  };

  async loadLocations(): Promise<void> {
    const { uid } = firebase.auth().currentUser!;
    try {
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
    } catch (err) {
      // TODO
    }
  }

  logout(): void {
    firebase.auth().signOut();
  }

  render() {
    const { history } = this.props;
    const { locations } = this.state;
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          flexFlow: 'column',
          height: '100vh',
        }}
      >
        <AppBar history={history} page="Scouting" />
        <div
          style={{
            display: 'flex',
            flexWrap: 'nowrap',
            flexFlow: 'row',
            height: '100%',
            overflow: 'auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              flex: 3,
              height: '100%',
            }}
          >
            <LocationScoutingMap
              locations={locations}
              onClick={this.createElement}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flex: 1,
              height: '100%',
            }}
          >
            <MapElementList
              locations={locations}
              onDelete={this.deleteLocation}
            />
          </div>
        </div>
      </div>
    );
  }
}
