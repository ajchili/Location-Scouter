import { EventEmitter } from 'events';
import { service as FirebaseService } from './FirebaseService';

export class FirebaseReliantService extends EventEmitter {
  constructor() {
    super();
    FirebaseService.initialize();
  }
}
