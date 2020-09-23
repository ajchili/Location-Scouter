import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { FirebaseReliantService } from './FirebaseReliantService';

export abstract class FirebaseCollectionService<
  T
> extends FirebaseReliantService {
  items: Record<string, T> = {};

  private get actionHashKey(): string {
    return `${this.collectionName}ActionHash`;
  }

  abstract get collectionName(): string;

  get collectionAsArray(): any {
    const array = [];
    for (let id in this.items) {
      array.push({
        ...this.items[id],
        id,
      });
    }
    return array;
  }

  protected get uid(): string {
    const { currentUser } = firebase.auth();
    if (currentUser === null) {
      throw new Error('No authenticated user!');
    }
    return currentUser.uid;
  }

  async createItem(data: T): Promise<void> {
    this.validateAction();
    const hash = this.generateActionHash();
    await this.writeActionHashToFirebase(hash);
    const doc = await firebase
      .firestore()
      .collection(this.collectionName)
      .add(data);
    this.items[doc.id] = data;
    this.emit('itemsUpdated');
  }

  async deleteItem(id: string): Promise<void> {
    this.validateAction();
    if (this.items[id] === undefined) {
      throw new Error(
        `Cannot delete item with id "${id}". Item does not exist!`
      );
    }
    const hash = this.generateActionHash();
    await this.writeActionHashToFirebase(hash);
    await firebase.firestore().collection(this.collectionName).doc(id).delete();
    delete this.items[id];
    this.emit('itemsUpdated');
  }

  private generateActionHash(): string {
    return (+new Date()).toString(36);
  }

  async isLocalStorageUpdated(): Promise<boolean> {
    const hashes = await firebase
      .firestore()
      .collection('hashes')
      .doc(this.uid)
      .get();
    if (!hashes.exists) {
      return false;
    }
    const hash = (hashes.data() || {})[this.collectionName] || 'undefined';
    if (hash.length === 'undefined') {
      return false;
    }
    return hash === (window.localStorage.getItem(this.actionHashKey) || '');
  }

  async loadItems(query: firebase.firestore.Query): Promise<void> {
    const isLocalStorageUpdated = await this.isLocalStorageUpdated();
    if (isLocalStorageUpdated) {
      this.items = JSON.parse(
        window.localStorage.getItem(this.collectionName) || '{}'
      );
      this.emit('itemsLoaded');
      return;
    }
    try {
      const queryData = await query.get();
      queryData.docs.forEach((doc) => {
        this.items[doc.id] = doc.data() as T;
      });
      await this.updateLocalStorage();
      this.emit('itemsLoaded');
    } catch {
      this.emit('itemLoadFailed');
    }
  }

  async updateItem(id: string, data: T): Promise<void> {
    this.validateAction();
    if (this.items[id] === undefined) {
      throw new Error(
        `Cannot update item with id "${id}". Item does not exist!`
      );
    }
    const hash = this.generateActionHash();
    await this.writeActionHashToFirebase(hash);
    await firebase
      .firestore()
      .collection(this.collectionName)
      .doc(id)
      .update(data);
    Object.assign(this.items[id], data);
    this.emit('itemsUpdated', true);
  }

  private async updateLocalStorage(): Promise<void> {
    const hashes = await firebase
      .firestore()
      .collection('hashes')
      .doc(this.uid)
      .get();
    const hash = (hashes.data() || {})[this.collectionName] || 'undefined';
    window.localStorage.setItem(this.actionHashKey, hash);
    window.localStorage.setItem(
      this.collectionName,
      JSON.stringify(this.items)
    );
  }

  async writeActionHashToFirebase(hash: string): Promise<void> {
    try {
      await firebase
        .firestore()
        .collection('hashes')
        .doc(this.uid)
        .update({
          [this.collectionName]: hash,
        });
    } catch (err) {
      if (err.code === 'not-found') {
        await firebase
          .firestore()
          .collection('hashes')
          .doc(this.uid)
          .set({
            [this.collectionName]: hash,
          });
      } else {
        throw err;
      }
    }
  }

  abstract validateAction(): void;
}
