import { DH_CHECK_P_NOT_PRIME } from 'constants';
import firebase from 'firebase/app';
import 'firebase/firestore';
import firebaseConfig from './config';

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export enum FirebaseServiceStatus { SUCCESS, FAILURE }

interface FirebaseResponse<T> {
  status: FirebaseServiceStatus,
  message: string,
  response?: T
}

function FirebaseSuccess<T>(r: T): FirebaseResponse<T> {
  return { status: FirebaseServiceStatus.SUCCESS, message: "", response: r }
}

function FirebaseFailure<T>(msg: string): FirebaseResponse<T> {
  return {
    status: FirebaseServiceStatus.FAILURE,
    message: msg,
    response: undefined
  }
}

export async function CreateGame(gameId: string, playerAlias: string):
  Promise<FirebaseResponse<string>> {
  const gameDocRef: firebase.firestore.DocumentReference =
    db.collection("activeGames").doc(gameId);
  return gameDocRef.get().then(doc => {
    if (doc.exists) {
      return FirebaseFailure<string>(
        `Active game with ID ${gameId} already exists!`
      );
    } else {
      return gameDocRef.set({
        playerOneAlias: playerAlias,
        gameId: gameId,
        playerOneTurn: true,
        playerOneMana: 1,
        playerTwoMana: 1
      })
        .then(_ => FirebaseSuccess(doc.id))
        .catch(err =>
          FirebaseFailure<string>(err)
        );
    }
  }).catch(err => FirebaseFailure<string>(err));
}

export function GetActiveGameRef(gameId: string):
  firebase.firestore.DocumentReference {
  return db.collection("activeGames").doc(gameId);
}