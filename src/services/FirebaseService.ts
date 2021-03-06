import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions';
import CardI from '../interfaces/CardI';
import firebaseConfig from './config';

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const fns = firebase.functions();

// ALSO CHANGE IN functions/src/index.ts
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
// ALSO CHANGE IN functions/src/index.ts

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

export async function JoinGame(gameId: string, playerAlias: string):
  Promise<FirebaseResponse<string>> {
  const fn = fns.httpsCallable("joinGame");
  return fn({ gameId, playerAlias })
    .then(resp => resp.data as FirebaseResponse<string>)
    .catch(err => err.data as FirebaseResponse<string>)
}

export async function PlayCardFromHand(gameId: string, isPlayerOne: boolean,
  newBoard: CardI[], newHand: CardI[]):
  Promise<FirebaseResponse<string>> {
  const fn = fns.httpsCallable("playCardFromHand");
  return fn({ gameId, isPlayerOne, newBoard, newHand })
    .then(resp => resp.data as FirebaseResponse<string>)
    .catch(err => err.data as FirebaseResponse<string>)
}