import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { FirebaseReliantService } from './FirebaseReliantService';

export class LocationManagerService extends FirebaseReliantService {
  public locations: any[] = [];

  async createLocation(
    name: string,
    position: google.maps.LatLngLiteral,
    originalData: string | null = null
  ): Promise<void> {
    const { currentUser } = firebase.auth();
    if (currentUser === null) {
      throw new Error('No authenticated user!');
    }
    const data = {
      ...position,
      name,
      originalData,
      owner: currentUser.uid,
    };
    const doc = await firebase.firestore().collection('locations').add(data);
    this.locations.push({
      ...data,
      id: doc.id,
    });
    this.emit('locationCreated');
  }

  async deleteLocation(id: string): Promise<void> {
    const { currentUser } = firebase.auth();
    if (currentUser === null) {
      throw new Error('No authenticated user!');
    }
    await firebase.firestore().collection('locations').doc(id).delete();
    this.locations = this.locations.filter((location) => location.id !== id);
    this.emit('locationDeleted');
  }

  deselectLocation() {
    this.emit('locationDeselected');
  }

  async loadLocations(): Promise<void> {
    const { currentUser } = firebase.auth();
    if (currentUser === null) {
      this.emit('locationLoadFailed', new Error('No authenticated user!'));
      return;
    }
    try {
      const query = await firebase
        .firestore()
        .collection('locations')
        .where('owner', '==', currentUser.uid)
        .get();
      this.locations = query.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        };
      });
      this.emit('locationsLoaded');
    } catch (err) {
      this.emit('locationLoadFailed', err);
    }
  }

  promptForEdits(location: any) {
    this.emit('startEditing', location);
  }

  selectLocation(location: any) {
    this.emit('locationSelected', location);
  }

  async updateLocation(id: string, name: string): Promise<void> {
    const { currentUser } = firebase.auth();
    if (currentUser === null) {
      throw new Error('No authenticated user!');
    }
    const data = {
      name,
    };
    await firebase.firestore().collection('locations').doc(id).update(data);
    const location = this.locations.find((location) => location.id === id);
    if (location) {
      location.name = name;
    }
    this.emit('locationEdited');
  }
}

export const service = new LocationManagerService();
