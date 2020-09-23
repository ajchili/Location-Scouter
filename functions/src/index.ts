import * as admin from 'firebase-admin';

admin.initializeApp();

export { handler as APIKeyFetcherHandler } from './RequestHandlers/APIKeyFetcher';
