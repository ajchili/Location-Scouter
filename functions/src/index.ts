import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const getUserUidFromEmail = functions.https.onCall((data, context) => {
  if (data.email) {
    const email: string = data.email;
    if (email.length) {
      return admin
        .auth()
        .getUserByEmail(email)
        .then(userRecord => {
          return userRecord.uid;
        })
        .catch(err => {
          throw err;
        });
    } else throw new Error("Blank email provided!");
  } else throw new Error("No email provided!");
});
