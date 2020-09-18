import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { ClickEventValue, Coords } from 'google-map-react';
import { RouteComponentProps } from 'react-router-dom';
import { AppBar, CreateMapElement, Map, MapElementList } from '../Components';

export interface Props extends RouteComponentProps {}

export interface State {
  center?: Coords;
  createMapElement?: Coords;
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
    try {
      const doc = await firebase.firestore().collection('locations').add(data);
      const { locations } = this.state;
      this.setState({
        center: undefined,
        createMapElement: undefined,
        locations: [{ id: doc.id, ...data }].concat(locations),
      });
    } catch (err) {
      // TODO
    }
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
    const {
      center,
      createMapElement,
      locations,
      selectedMapElement,
    } = this.state;
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
          <Map
            center={center}
            locations={locations}
            onClick={this.createElement}
            onCenterUpdated={() => {
              if (
                this.state.center !== undefined &&
                this.state.createMapElement === undefined &&
                this.state.selectedMapElement === undefined
              ) {
                this.setState({ center: undefined });
              }
            }}
            children={
              <>
                {createMapElement && (
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
                )}
                {selectedMapElement && (
                  <CreateMapElement
                    defaultName={selectedMapElement.name}
                    lat={selectedMapElement.lat}
                    lng={selectedMapElement.lng}
                    onCancel={() => {
                      this.setState({
                        center: undefined,
                        createMapElement: undefined,
                        selectedMapElement: undefined,
                      });
                    }}
                    onCreate={() => {
                      this.setState({
                        center: undefined,
                        createMapElement: undefined,
                        selectedMapElement: undefined,
                      });
                    }}
                  />
                )}
              </>
            }
          />
          <div
            style={{
              display: 'flex',
              height: '100%',
              width: '25%',
            }}
          >
            <MapElementList
              locations={locations}
              onClick={(id: string) => {
                const location = locations.find(
                  (location) => location.id === id
                );
                if (location) {
                  this.setState({
                    center: { lat: location.lat, lng: location.lng },
                    selectedMapElement: location,
                  });
                }
              }}
              onDelete={this.deleteLocation}
            />
          </div>
        </div>
      </div>
    );
  }
}
