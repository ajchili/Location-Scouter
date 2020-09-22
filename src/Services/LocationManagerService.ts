import firebase from 'firebase/app';
import 'firebase/firestore';
import { FirebaseCollectionService } from './FirebaseCollectionService';

export class LocationManagerService extends FirebaseCollectionService<any> {
  get collectionName(): string {
    return 'locations';
  }

  deselectLocation() {
    this.emit('locationDeselected');
  }

  async createItem(data: any): Promise<void> {
    await super.createItem({
      ...data,
      owner: this.uid,
    });
  }

  async loadItems(): Promise<void> {
    await super.loadItems(
      firebase
        .firestore()
        .collection(this.collectionName)
        .where('owner', '==', this.uid)
    );
  }

  promptForEdits(location: any) {
    this.emit('startEditing', location);
  }

  selectLocation(location: any) {
    this.emit('locationSelected', location);
  }

  validateAction() {
    return this.uid;
  }
}

export const service = new LocationManagerService();
