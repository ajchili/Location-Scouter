import { EventEmitter } from 'events';
import * as firebase from 'firebase/app';

export class FirebaseService extends EventEmitter {
  private initialized: boolean = false;

  initialize() {
    if (this.initialized || firebase.apps.length > 0) {
      return;
    }
    firebase.initializeApp({
      apiKey: process.env.REACT_APP_API_KEY,
      authDomain: process.env.REACT_APP_AUTH_DOMAIN,
      databaseURL: process.env.REACT_APP_DATABASE_URL,
      projectId: process.env.REACT_APP_PROJECT_ID,
      storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_MESSAGE_SENDER_ID,
      appId: process.env.REACT_APP_APP_ID,
    });
    this.emit('initialized');
    this.initialized = true;
  }
}

export const service = new FirebaseService();
