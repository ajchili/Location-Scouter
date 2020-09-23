import React, { Component } from 'react';
import MarkerClusterer from '@google/markerclustererplus';
import { Card, CardContent } from '@material-ui/core';
import {
  CreateMapElement,
  EditMapElement,
  Loader,
  LocationScoutingStreetview,
} from '../Components';
import { LocationManagerService, MappingService } from '../Services';
let MarkerWithLabels = require('markerwithlabel');

export interface Props {
  locations: any[];
}

export interface State {
  loading: boolean;
  loadingText: string;
  showCreateMapElementDialog: boolean;
  showEditMapElementDialog: boolean;
}

export class LocationScoutingMap extends Component<Props, State> {
  private clusterer?: MarkerClusterer;
  private id: string = `map-${new Date().getTime()}`;
  private map?: google.maps.Map<HTMLDivElement>;
  private ref: React.RefObject<HTMLDivElement> = React.createRef();
  private selectedMapElement?: google.maps.Marker;
  private static wasMarkerWithLabelsSet: boolean = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      loadingText: 'Loading Map',
      showCreateMapElementDialog: false,
      showEditMapElementDialog: false,
    };
  }

  get selectedMapElementId(): string | undefined {
    const { locations } = this.props;
    if (this.selectedMapElement === undefined) {
      return;
    }
    const position = this.selectedMapElementPosition;
    if (position === undefined) {
      return;
    }
    for (let location of locations) {
      if (
        this.selectedMapElement.getTitle() === location.name &&
        position.lat === location.lat &&
        position.lng === location.lng
      ) {
        return location.id;
      }
    }
    return;
  }

  get selectedMapElementPosition(): google.maps.LatLngLiteral | undefined {
    if (this.selectedMapElement === undefined) {
      return;
    }
    const position = this.selectedMapElement.getPosition();
    if (position === undefined || position === null) {
      return;
    }
    return {
      lat: position.lat(),
      lng: position.lng(),
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

  deselectMapElement = () => {
    if (this.map !== undefined && this.selectedMapElement !== undefined) {
      this.selectedMapElement = undefined;
      this.setState({
        showEditMapElementDialog: false,
      });
      this.map.setValues({
        gestureHandling: 'greedy',
      });
    }
  };

  loadMap = async () => {
    this.setState({ loading: true, loadingText: 'Loading Map' });
    try {
      await MappingService.loadGoogleMaps('map');
      if (!LocationScoutingMap.wasMarkerWithLabelsSet) {
        MarkerWithLabels = MarkerWithLabels(google.maps);
        LocationScoutingMap.wasMarkerWithLabelsSet = true;
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
    this.setupLocationManagerServiceListeners();
    this.setupMapListeners();
    this.setupMappingServiceListeners();
    this.setupWindowListeners();
    this.setupCluserer();
    this.setState({ loading: false });
  };

  locationToMarkerWithLabels = (location: any): google.maps.Marker => {
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
        LocationManagerService.selectLocation(location);
      });
    });
    return marker;
  };

  selectLocation = (location: any) => {
    if (
      this.map === undefined ||
      this.selectedMapElement !== undefined ||
      this.clusterer === undefined
    ) {
      return;
    }
    for (let marker of this.clusterer.getMarkers()) {
      const position = marker.getPosition();
      if (
        marker.getTitle() === location.name &&
        position !== null &&
        position !== undefined &&
        position.lat() === location.lat &&
        position.lng() === location.lng
      ) {
        const markerOffset = { x: 0, y: window.document.body.offsetHeight / 4 };
        MappingService.setCenterWithPadding(
          {
            lat: location.lat,
            lng: location.lng,
          },
          markerOffset
        );
        this.map.setValues({
          gestureHandling: 'none',
        });
        this.selectedMapElement = marker;
        this.setState({
          showEditMapElementDialog: true,
        });
        break;
      }
    }
  };

  setupCluserer = (forceUpdate: boolean = false) => {
    const { locations } = this.props;
    if (this.map === undefined) {
      return;
    }
    if (this.clusterer === undefined) {
      this.clusterer = new MarkerClusterer(
        this.map,
        locations.map(this.locationToMarkerWithLabels),
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
      if (
        this.clusterer.getMarkers().length === locations.length &&
        forceUpdate === false
      ) {
        return;
      }
      this.clusterer.clearMarkers();
      this.clusterer.addMarkers(locations.map(this.locationToMarkerWithLabels));
    }
  };

  setupLocationManagerServiceListeners = () => {
    LocationManagerService.addListener('itemsUpdateTriggered', () =>
      this.setState({ loading: true, loadingText: 'Updating Map' })
    );
    LocationManagerService.addListener(
      'itemsUpdated',
      (isUpdate: boolean = false) => {
        const {
          showCreateMapElementDialog,
          showEditMapElementDialog,
        } = this.state;
        if (showCreateMapElementDialog) {
          this.cancelCreateMapElement();
        } else if (showEditMapElementDialog) {
          this.deselectMapElement();
        }
        if (isUpdate) {
          this.setupCluserer(true);
        }
        this.setState({ loading: false });
      }
    );
    LocationManagerService.addListener('locationDeselected', () => {
      this.deselectMapElement();
    });
    LocationManagerService.addListener('locationSelected', (location: any) => {
      this.selectLocation(location);
    });
  };

  setupMapListeners = () => {
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
        if (this.map.getZoom() < 16) {
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
      this.forceUpdate();
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
    const {
      loading,
      loadingText,
      showCreateMapElementDialog,
      showEditMapElementDialog,
    } = this.state;
    return (
      <div style={{ height: '100%', width: '100%', position: 'relative' }}>
        {loading && <Loader text={loadingText} />}
        <div
          id={this.id}
          ref={this.ref}
          style={{ height: '100%', width: '100%' }}
        />
        {this.selectedMapElement !== undefined &&
          this.selectedMapElementPosition !== undefined &&
          (showCreateMapElementDialog || showEditMapElementDialog) && (
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
                {showCreateMapElementDialog && (
                  <CreateMapElement
                    position={this.selectedMapElementPosition}
                    onCancel={this.cancelCreateMapElement}
                  />
                )}
                {showEditMapElementDialog &&
                  this.selectedMapElementId !== undefined && (
                    <EditMapElement
                      id={this.selectedMapElementId}
                      name={this.selectedMapElement.getTitle() || ''}
                    />
                  )}
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
