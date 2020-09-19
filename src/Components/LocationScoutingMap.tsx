import React, { Component } from 'react';
import MarkerClusterer from '@google/markerclustererplus';
import { Card, CardContent } from '@material-ui/core';
import { CreateMapElement, LocationScoutingStreetview } from '../Components';
import { MappingService } from '../Services';
let MarkerWithLabels = require('markerwithlabel');

export interface Props {
  locations: any[];
  onClick?: (location: google.maps.LatLngLiteral) => void;
}

export interface State {
  showCreateMapElementDialog: boolean;
}

export class LocationScoutingMap extends Component<Props, State> {
  private clusterer?: MarkerClusterer;
  private id: string = `map-${new Date().getTime()}`;
  private map?: google.maps.Map<HTMLDivElement>;
  private ref: React.RefObject<HTMLDivElement> = React.createRef();
  private selectedMapElement?: google.maps.Marker;
  private wasMarkerWithLabelsSet: boolean = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      showCreateMapElementDialog: false,
    };
  }

  componentDidMount() {
    this.loadMap();
  }

  componentDidUpdate() {
    this.setupCluserer();
  }

  cancelCreateMapElement = () => {
    if (this.map !== undefined && this.selectedMapElement !== undefined) {
      this.selectedMapElement.setMap(null);
      this.selectedMapElement = undefined;
      this.setState({
        showCreateMapElementDialog: false,
      });
      this.map.setValues({
        gestureHandling: 'greedy',
      });
    }
  };

  createMapElement = (coords: google.maps.LatLngLiteral) => {
    if (this.map === undefined || this.selectedMapElement !== undefined) {
      return;
    }
    const markerOffset = { x: 0, y: window.document.body.offsetHeight / 4 };
    MappingService.setCenterWithPadding(coords, markerOffset);
    const marker = new MarkerWithLabels({
      draggable: true,
      labelAnchor: new google.maps.Point(0, 0),
      labelClass: 'labels',
      labelContent: 'New Location',
      map: this.map,
      position: coords,
    });
    marker.addListener('dragstart', (dragEvent: google.maps.MouseEvent) => {
      this.setState({
        showCreateMapElementDialog: false,
      });
    });
    marker.addListener('dragend', (dragEvent: google.maps.MouseEvent) => {
      MappingService.setCenterWithPadding(
        { lat: dragEvent.latLng.lat(), lng: dragEvent.latLng.lng() },
        markerOffset
      );
      this.setState({
        showCreateMapElementDialog: true,
      });
    });
    this.map.setValues({
      gestureHandling: 'none',
    });
    this.selectedMapElement = marker;
    this.setState({
      showCreateMapElementDialog: true,
    });
  };

  loadMap = async () => {
    try {
      await MappingService.loader.load();
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
    this.setupWindowListeners();
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
        const coords = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        if (this.map !== undefined) {
          this.createMapElement(coords);
        }
        if (onClick) {
          onClick(coords);
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
    MappingService.on('panTo', (center: google.maps.LatLngLiteral) => {
      if (this.map !== undefined) {
        this.map.panTo(center);
        if (this.map.getZoom() !== 16) {
          this.map.setZoom(16);
        }
      }
    });
    MappingService.on('panBy', (position: { x: number; y: number }) => {
      if (this.map !== undefined) {
        this.map.panBy(position.x, position.y);
      }
    });
  };

  streetviewPositionChanged = (position: google.maps.LatLngLiteral) => {
    if (this.selectedMapElement !== undefined) {
      this.selectedMapElement.setPosition(position);
      const markerOffset = { x: 0, y: window.document.body.offsetHeight / 4 };
      MappingService.setCenterWithPadding(position, markerOffset);
    }
  };

  setupWindowListeners = () => {
    window.addEventListener('resize', () => {
      if (this.selectedMapElement !== undefined) {
        const markerOffset = { x: 0, y: window.document.body.offsetHeight / 4 };
        const position = this.selectedMapElement.getPosition();
        if (position === null || position === undefined) {
          return;
        }
        MappingService.setCenterWithPadding(
          {
            lat: position.lat(),
            lng: position.lng(),
          },
          markerOffset
        );
      }
    });
  };

  render() {
    const { showCreateMapElementDialog } = this.state;
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <div
          id={this.id}
          ref={this.ref}
          style={{ height: '100%', width: '100%' }}
        />
        {this.selectedMapElement !== undefined && showCreateMapElementDialog && (
          <div
            style={{
              bottom: '5%',
              display: 'flex',
              flexDirection: 'row',
              left: '5%',
              gap: '2%',
              top: '50%',
              position: 'absolute',
              right: '30%',
            }}
          >
            <div style={{ flex: 1 }}>
              <CreateMapElement
                onCancel={this.cancelCreateMapElement}
                onCreate={() => {}}
              />
            </div>
            <div style={{ flex: 3 }}>
              <Card style={{ height: '100%', width: '100%' }}>
                <CardContent
                  style={{
                    height: 'calc(100% - 32px)',
                    width: 'calc(100% - 32px)',
                  }}
                >
                  <LocationScoutingStreetview
                    position={{
                      lat: this.selectedMapElement.getPosition()!.lat(),
                      lng: this.selectedMapElement.getPosition()!.lng(),
                    }}
                    onPositionChange={
                      showCreateMapElementDialog
                        ? this.streetviewPositionChanged
                        : undefined
                    }
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    );
  }
}
