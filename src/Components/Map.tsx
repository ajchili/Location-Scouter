import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import GoogleMapReact, {
  ChangeEventValue,
  ClickEventValue,
  Coords,
  Maps,
} from 'google-map-react';
import { MapIcon } from './';

export interface Props {
  center?: Coords;
  locations: any[];
  onCenterUpdated: () => void;
  onClick?: (event: ClickEventValue) => void;
  streetView?: boolean;
}

export interface State {
  center?: Coords;
  creatingNewLocation: boolean;
  canUseMap: boolean;
  map?: any;
  maps?: Maps;
  ref: Element | null;
}

const defaultCenter: Coords = {
  lat: parseFloat(window.localStorage.getItem('mapLat') || '0'),
  lng: parseFloat(window.localStorage.getItem('mapLng') || '0'),
};
const defaultZoom: number = parseInt(
  window.localStorage.getItem('mapDefaultZoom') || '0',
  10
);

export class Map extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      center: props.center,
      creatingNewLocation: false,
      canUseMap: true,
      ref: null,
    };
  }

  componentDidUpdate() {
    const { center: newCenter, onCenterUpdated } = this.props;
    const { center } = this.state;
    if (newCenter !== undefined && newCenter !== center) {
      this.setState({ center: newCenter });
      onCenterUpdated();
    }
  }

  logUsage = async (maps: {
    map: any;
    maps: Maps;
    ref: Element | null;
  }): Promise<void> => {
    const { streetView } = this.props;
    const { uid } = firebase.auth().currentUser!;
    const date = new Date();
    const service = streetView || false ? 'streetview' : 'map';
    const quotaPeriod = `${service}#${date.getFullYear()}-${date.getMonth()}`;
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
      console.log(quotaPeriod, usage);
      if (streetView === true) {
        this.setupStreetView(maps.map);
      }
    } catch (err) {
      console.error(err);
      this.setState({ canUseMap: false });
    } finally {
      this.setState(maps);
    }
  };

  setupStreetView = (map: any) => {
    const { center } = this.props;
    const pano = map.getStreetView();
    pano.setPosition(center);
    pano.enableCloseButton = false;
    pano.setVisible(true);
  };

  private get GoogleMapsAPIKey(): string {
    return process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
  }

  render() {
    const { locations, onClick, streetView } = this.props;
    const { center } = this.state;
    return (
      <GoogleMapReact
        bootstrapURLKeys={{ key: this.GoogleMapsAPIKey }}
        center={center}
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
        onClick={onClick}
        onGoogleApiLoaded={this.logUsage}
        onMapTypeIdChange={(mapTypeId) =>
          window.localStorage.setItem('mapTypeId', mapTypeId)
        }
        onChange={(event: ChangeEventValue) => {
          const { center, zoom } = event;
          this.setState({ center });
          window.localStorage.setItem('mapLat', center.lat.toString());
          window.localStorage.setItem('mapLng', center.lng.toString());
          window.localStorage.setItem('mapDefaultZoom', zoom.toString());
        }}
        options={{
          disableDoubleClickZoom: true,
          fullscreenControl: !(streetView || false),
          mapTypeId: window.localStorage.getItem('mapTypeId') || 'hybrid',
          mapTypeControl: !(streetView || false),
          zoomControl: !(streetView || false),
        }}
        yesIWantToUseGoogleMapApiInternals
      >
        {locations.map((location) => (
          <MapIcon
            key={location.id}
            lat={location.lat}
            lng={location.lng}
            onClick={() => {
              console.log('Clicked', location.id);
              this.setState({
                center: { lat: location.lat, lng: location.lng },
              });
            }}
          />
        ))}
        {this.props.children}
      </GoogleMapReact>
    );
  }
}
