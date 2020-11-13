import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Account, APIKeyName } from '../Types';
import { API_QUOTA_LIMITS } from '../Constants';

export const handler = functions.https.onCall(
  async (
    data: { api: APIKeyName | undefined },
    context: functions.https.CallableContext
  ) => {
    const { auth } = context;
    if (auth === undefined) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function must be called while authenticated!'
      );
    }
    const { api } = data;
    if (api === undefined || API_QUOTA_LIMITS[api] === undefined) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with one arguments "api" containing a valid api name.'
      );
    }
    const { uid } = auth;
    const date = new Date();
    const userDoc = await admin
      .firestore()
      .collection('accounts')
      .doc(uid)
      .get();
    if (!userDoc.exists) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Account not authorized to access resource!'
      );
    }
    const { tier = 'none', type = 'unauthenticated' } =
      (userDoc.data() as Account) || {};
    if (tier === 'none' || type === 'unauthenticated') {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Account not authorized to access resource!'
      );
    }
    const quotaPeriod = `${data.api}#${date.getFullYear()}-${date.getMonth()}`;
    const docReference = admin.firestore().collection('quotas').doc(uid);
    const usage = await admin.firestore().runTransaction(
      async (transaction: admin.firestore.Transaction): Promise<number> => {
        const doc = await transaction.get(docReference);
        if (!doc.exists) {
          transaction.set(docReference, { [quotaPeriod]: 1 });
          return 1;
        } else {
          const docData = doc.data() || {};
          const currentQuotaUsage = isNaN(docData[quotaPeriod])
            ? 1
            : docData[quotaPeriod];
          if (currentQuotaUsage === API_QUOTA_LIMITS[api][tier]) {
            return currentQuotaUsage;
          }
          const newQuotaUsage = currentQuotaUsage + 1;
          transaction.update(docReference, { [quotaPeriod]: newQuotaUsage });
          return newQuotaUsage;
        }
      }
    );
    if (usage >= API_QUOTA_LIMITS[api][tier]) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Account has exceeded api usage!'
      );
    } else {
      return {
        key: functions.config().google_maps.key,
        usage,
        quotaPeriod,
      };
    }
  }
);
