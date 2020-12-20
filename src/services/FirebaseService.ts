import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions';
import firebaseConfig from './config';

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const fns = firebase.functions();

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

export async function CreateGame(gameId: string, playerAlias: string):
  Promise<FirebaseResponse<string>> {
  const fn = fns.httpsCallable("newRandomDeckGame");
  return fn({ gameId, playerAlias })
    .then(resp => resp.data as FirebaseResponse<string>)
    .catch(err => err.data as FirebaseResponse<string>)
}

export function GetActiveGameRef(gameId: string):
  firebase.firestore.DocumentReference {
  return db.collection("activeGames").doc(gameId);
}