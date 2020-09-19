import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { FirebaseReliantService } from './FirebaseReliantService';

export interface Account {
  tier: AccountTier;
  type: AccountType;
}
export type AccountTier = 'admin' | 'sponsor' | 'basic' | 'none';
export type AccountType = 'admin' | 'user' | 'unauthenticated';

export class AuthenticationService extends FirebaseReliantService {
  accountTier: AccountTier = 'none';
  accountType: AccountType = 'unauthenticated';

  constructor() {
    super();
    firebase.auth().onAuthStateChanged(async () => {
      try {
        await this.refresh();
      } catch (err) {
        console.error(err);
        this.emit('accountUpdateFailed', err);
      }
    });
  }

  get user(): firebase.User | null {
    return firebase.auth().currentUser;
  }

  async refresh(): Promise<void> {
    const user = this.user;
    if (user === null) {
      this.accountTier = 'none';
      this.accountType = 'unauthenticated';
      this.emit('accountUpdated');
      return;
    }
    const doc = await firebase
      .firestore()
      .collection('accounts')
      .doc(user.uid)
      .get();
    const { tier = 'none', type = 'unauthenticated' } =
      (doc.data() as Account) || {};
    this.accountTier = tier;
    this.accountType = type;
    this.emit('accountUpdated');
  }
}

export const service = new AuthenticationService();
