import { EventEmitter } from 'events';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export class LocationManagerService extends EventEmitter {
  public locations: any[] = [];

  loadLocations = async (): Promise<void> => {
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
  };
}

export const service = new LocationManagerService();
