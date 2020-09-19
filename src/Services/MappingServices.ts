import { EventEmitter } from 'events';
import { Loader } from '@googlemaps/js-api-loader';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export class MappingService extends EventEmitter {
  private loader: Loader = new Loader({
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

  async loadGoogleMaps(service: 'map' | 'streetview') {
    await this.loader.load();
    const { uid } = firebase.auth().currentUser!;
    const date = new Date();
    const quotaPeriod = `${service}#${date.getFullYear()}-${date.getMonth()}`;
    const docReference = firebase.firestore().collection('quotas').doc(uid);
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
