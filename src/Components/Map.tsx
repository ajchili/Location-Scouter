import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import GoogleMapReact, { ClickEventValue } from 'google-map-react';
import { MapIcon } from '../Components';

export interface Props {
  locations: any[];
  onClick?: (event: ClickEventValue) => void;
}

export interface State {
  creatingNewLocation: boolean;
  canUseMap: boolean;
}

export class Map extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      creatingNewLocation: false,
      canUseMap: true,
    };
  }

  logUsage = async (): Promise<void> => {
    const { uid } = firebase.auth().currentUser!;
    const date = new Date();
    const quotaPeriod = `map#${date.getFullYear()}-${date.getMonth()}`;
    const docReference = firebase.firestore().collection('quotas').doc(uid);
    try {
      const usage = await firebase.firestore().runTransaction(
        async (transaction): Promise<any> => {
          const doc = await transaction.get(docReference);
          if (!doc.exists) {
            transaction.set(docReference, { [quotaPeriod]: 1 });
            return 1;
          } else {
            const data = doc.data() || {};
            const currentQuotaUsage = isNaN(data[quotaPeriod])
              ? 1
              : data[quotaPeriod];
            const newQuotaUsage = currentQuotaUsage + 1;
            transaction.update(docReference, { [quotaPeriod]: newQuotaUsage });
            return newQuotaUsage;
          }
        }
      );
      console.log(usage);
    } catch (err) {
      this.setState({ canUseMap: false });
    }
  };

  private get GoogleMapsAPIKey(): string {
    return process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
  }

  render() {
    const { locations, onClick } = this.props;
    return (
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
        onClick={onClick}
        onGoogleApiLoaded={this.logUsage}
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
          mapTypeId: window.localStorage.getItem('mapTypeId') || 'hybrid',
          mapTypeControl: true,
          streetViewControl: true,
        }}
      >
        {locations.map((location) => (
          <MapIcon
            key={location.id}
            lat={location.lat}
            lng={location.lng}
            onClick={() => console.log('Clicked', location.id)}
          />
        ))}
      </GoogleMapReact>
    );
  }
}
