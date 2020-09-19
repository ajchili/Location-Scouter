import { EventEmitter } from 'events';

export class MappingService extends EventEmitter {
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
    this.emit('centerSet', center);
  }
}

export const service = new MappingService();
