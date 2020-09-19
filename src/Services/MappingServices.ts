import { EventEmitter } from 'events';
import { Loader } from '@googlemaps/js-api-loader';

export class MappingService extends EventEmitter {
  loader: Loader = new Loader({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  });

  get savedCenter(): google.maps.LatLngLiteral {
    return {
      lat: parseFloat(window.localStorage.getItem('mapLat') || '0'),
      lng: parseFloat(window.localStorage.getItem('mapLng') || '0'),
    };
  }

  get savedMapTypeId(): string {
    return window.localStorage.getItem('mapTypeId') || 'roadmap';
  }

  get savedZoom(): number {
    return parseInt(window.localStorage.getItem('mapZoom') || '0', 10);
  }

  setCenter(center: google.maps.LatLngLiteral) {
    this.emit('panTo', center);
  }

  setCenterWithPadding(
    center: google.maps.LatLngLiteral,
    padding: { x: number; y: number }
  ) {
    this.emit('panTo', center);
    this.emit('panBy', padding);
  }
}

export const service = new MappingService();
