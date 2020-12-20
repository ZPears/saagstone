import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.firebaseConfig()!);

// ALSO CHANGE IN ../src/services/FirebaseService.ts
export enum FirebaseServiceStatus { SUCCESS, FAILURE }

export interface FirebaseResponse<T> {
  status: FirebaseServiceStatus,
  message: string,
  response?: T
}

export function FirebaseSuccess<T>(r: T): FirebaseResponse<T> {
  return { status: FirebaseServiceStatus.SUCCESS, message: "", response: r }
}

export function FirebaseFailure<T>(msg: string): FirebaseResponse<T> {
  return {
    status: FirebaseServiceStatus.FAILURE,
    message: msg,
    response: undefined
  }
}
// ALSO CHANGE IN ../src/services/FirebaseService.ts

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
      }).then(_ => FirebaseSuccess(doc.id))
        .catch(err => FirebaseFailure<string>(err))
    }
  }).catch(err => FirebaseFailure<string>(err))

})
