import React, { Component } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import MarkerClusterer from '@google/markerclustererplus';
import { MappingService } from '../Services';
let MarkerWithLabels = require('markerwithlabel');

export interface Props {
  locations: any[];
  onClick?: (location: google.maps.LatLngLiteral) => void;
}

export interface State {}

export class LocationScoutingMap extends Component<Props, State> {
  private clusterer?: MarkerClusterer;
  private id: string = `map-${new Date().getTime()}`;
  private static loader: Loader = new Loader({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  });
  private map?: google.maps.Map<HTMLDivElement>;
  private ref: React.RefObject<HTMLDivElement> = React.createRef();
  private wasMarkerWithLabelsSet: boolean = false;

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.loadMap();
  }

  componentDidUpdate() {
    this.setupCluserer();
  }

  loadMap = async () => {
    try {
      await LocationScoutingMap.loader.load();
      if (!this.wasMarkerWithLabelsSet) {
        MarkerWithLabels = MarkerWithLabels(google.maps);
        this.wasMarkerWithLabelsSet = true;
      }
    } catch (err) {
      console.error(err);
      return;
    }
    this.map = new google.maps.Map(this.ref.current!, {
      center: MappingService.savedCenter,
      fullscreenControl: false,
      mapTypeId: MappingService.savedMapTypeId,
      streetViewControl: false,
      zoom: MappingService.savedZoom,
    });
    this.setupMapListeners();
    this.setupMappingServiceListeners();
  };

  setupCluserer = () => {
    const { locations } = this.props;
    if (this.map === undefined) {
      return;
    }
    if (this.clusterer === undefined) {
      this.clusterer = new MarkerClusterer(
        this.map,
        locations.map((location) => {
          const marker = new MarkerWithLabels({
            labelAnchor: new google.maps.Point(0, 0),
            labelClass: 'labels',
            labelContent: location.name,
            position: {
              lat: location.lat,
              lng: location.lng,
            },
            title: location.name,
          });
          // Add click listener to maker and label.
          [marker, marker.label].forEach((element) => {
            element.addListener('click', () => {
              MappingService.setCenter({
                lat: location.lat,
                lng: location.lng,
              });
            });
          });
          return marker;
        }),
        {
          clusterClass: 'custom-clustericon',
          styles: [
            {
              width: 30,
              height: 30,
              className: 'custom-clustericon-1',
            },
            {
              width: 40,
              height: 40,
              className: 'custom-clustericon-2',
            },
            {
              width: 50,
              height: 50,
              className: 'custom-clustericon-3',
            },
          ],
        }
      );
    } else {
      if (this.clusterer.getMarkers().length === locations.length) {
        return;
      }
      this.clusterer.clearMarkers();
      this.clusterer.addMarkers(
        locations.map((location) => {
          return new google.maps.Marker({
            optimized: true,
            position: {
              lat: location.lat,
              lng: location.lng,
            },
            title: location.name,
          });
        })
      );
    }
  };

  setupMapListeners = () => {
    const { onClick } = this.props;
    if (this.map === undefined) {
      return;
    }
    this.map.addListener(
      'click',
      (event: google.maps.MouseEvent | google.maps.IconMouseEvent) => {
        if (Object.keys(event).includes('placeId')) {
          event.stop();
        }
        if (this.map !== undefined) {
          this.map.panTo({ lat: event.latLng.lat(), lng: event.latLng.lng() });
        }
        if (onClick) {
          onClick({ lat: event.latLng.lat(), lng: event.latLng.lng() });
        }
      }
    );
    this.map.addListener('center_changed', () => {
      if (this.map !== undefined) {
        const center = this.map.getCenter();
        window.localStorage.setItem('mapLat', center.lat().toString());
        window.localStorage.setItem('mapLng', center.lng().toString());
      }
    });
    this.map.addListener('maptypeid_changed', () => {
      if (this.map !== undefined) {
        const mapTypeId = this.map.getMapTypeId();
        window.localStorage.setItem('mapTypeId', mapTypeId);
      }
    });
    this.map.addListener('zoom_changed', () => {
      if (this.map !== undefined) {
        const zoom = this.map.getZoom();
        window.localStorage.setItem('mapZoom', zoom.toString());
      }
    });
  };

  setupMappingServiceListeners = () => {
    MappingService.on('centerSet', (center: google.maps.LatLngLiteral) => {
      if (this.map !== undefined) {
        this.map.panTo(center);
        if (this.map.getZoom() !== 16) {
          this.map.setZoom(16);
        }
      }
    });
  };

  render() {
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <div
          id={this.id}
          ref={this.ref}
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    );
  }
}
