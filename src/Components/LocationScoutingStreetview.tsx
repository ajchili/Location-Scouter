import React, { Component } from 'react';
import { MappingService } from '../Services';

export interface Props {
  position: google.maps.LatLngLiteral;
  onPositionChange?: (newPosition: google.maps.LatLngLiteral) => void;
}

export class LocationScoutingStreetview extends Component<Props> {
  private id: string = `pano-${new Date().getTime()}`;
  private panorama?: google.maps.StreetViewPanorama;
  private ref: React.RefObject<HTMLDivElement> = React.createRef();

  componentDidMount() {
    this.loadStreetView();
  }

  loadStreetView = async () => {
    const { position, onPositionChange } = this.props;
    if (position === undefined || position == null) {
      return;
    }
    try {
      await MappingService.loader.load();
    } catch (err) {
      console.error(err);
      return;
    }
    this.panorama = new google.maps.StreetViewPanorama(this.ref.current!, {
      clickToGo: onPositionChange !== undefined,
      disableDefaultUI: true,
      panControl: true,
      position,
      pov: {
        heading: 270,
        pitch: 0,
      },
      showRoadLabels: true,
      zoomControl: true,
    });
    this.setPanoramaListener();
  };

  setPanoramaListener = () => {
    if (this.panorama === undefined) {
      return;
    }
    this.panorama.addListener('position_changed', () => {
      const { onPositionChange } = this.props;
      if (this.panorama === undefined || onPositionChange === undefined) {
        return;
      }
      const position = {
        lat: this.panorama.getPosition().lat(),
        lng: this.panorama.getPosition().lng(),
      };
      onPositionChange(position);
    });
  };

  render() {
    return (
      <div
        id={this.id}
        ref={this.ref}
        style={{ height: '100%', width: '100%' }}
      />
    );
  }
}
