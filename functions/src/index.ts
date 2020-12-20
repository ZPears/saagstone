import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { FirebaseFailure, FirebaseSuccess } from './../../src/services/FirebaseService';

admin.initializeApp(functions.firebaseConfig()!);

const db = admin.firestore();

export const newRandomDeckGame = functions.https.onCall((data) => {
  if (data.gameId === undefined) {
    return FirebaseFailure("No gameId provided.")
  }
  if (data.playerAlias === undefined) {
    return FirebaseFailure("No playerAlias provided.")
  }

  const gameDocRef = db.collection("activeGames").doc(data.gameId);

  return gameDocRef.get().then(doc => {
    if (doc.exists) {
      return FirebaseFailure<string>(
        `Active game with ID ${data.gameId} already exists!`
      );
    } else {
      return gameDocRef.set({
        playerOneAlias: data.playerAlias,
        gameId: data.gameId,
        playerOneTurn: true,
        playerOneMana: 1,
        playerTwoMana: 1
      }).then(_ => { return FirebaseSuccess(doc.id) })
        .catch(err => { return FirebaseFailure<string>(err) })
    }
  }).catch(err => { return FirebaseFailure<string>(err) })

})
