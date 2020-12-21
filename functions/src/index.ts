import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import DocumentReference = admin.firestore.DocumentReference;
import DocumentData = admin.firestore.DocumentData;

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

// ALSO CHANGE IN ../src/interfaces/CardI.ts
export type CardType = "minion" | "spell";

export default interface CardI {
  cardId: string,
  cardName: string,
  cardType: CardType,
  baseAttack: number,
  baseHealth: number,
  currentHealth?: number,
  currentAttack?: number,
}
// ALSO CHANGE IN ../src/interfaces/CardI.ts

const DECK_SIZE = 30;

const db = admin.firestore();

// n integers in the interval[0, 1)
function randomIdxs(max: number, n: number) {
  return new Array(n).map(_ => Math.floor(Math.random() * Math.floor(max)))
}

function randomShuffle<T>(a: T, b: T) {
  return Math.random() - 0.5;
}

function randomDeck(cardIds: DocumentReference<DocumentData>[]):
  Map<DocumentReference<DocumentData>, number> {
  return randomIdxs(cardIds.length, DECK_SIZE)
    .map(idx => cardIds[idx])
    .reduce((deck: Map<DocumentReference<DocumentData>, number>, cardId: DocumentReference<DocumentData>) => {
      if (deck.get(cardId)) { deck.set(cardId, deck.get(cardId)! + 1) }
      else { deck.set(cardId, 1) }
      return deck;
    }, new Map<DocumentReference<DocumentData>, number>());
}

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
      return db.collection("cards").listDocuments()
        .then((cardIds: DocumentReference<DocumentData>[]) => {
          // TODO: Have two different decks per player.
          const deck: Map<DocumentReference<DocumentData>, number> =
            randomDeck(cardIds);

          const deckCardRefs = Array.from(deck.keys());

          return db.getAll(...deckCardRefs).then(cardResps => {
            const cards: CardI[] = cardResps.map(x => x.data()! as CardI);
            let playerOneDeck = cards.sort(randomShuffle);
            let playerTwoDeck = cards.sort(randomShuffle);
            const playerOneHand = playerOneDeck.splice(0, 4);
            const playerTwoHand = playerOneDeck.splice(0, 4);
            return gameDocRef.set({
              playerOneAlias: data.playerAlias,
              gameId: data.gameId,
              playerOneTurn: true,
              playerOneMana: 1,
              playerTwoMana: 1,
              playerOneDeck: playerOneDeck,
              playerOneHand: playerOneHand,
              playerTwoDeck: playerTwoDeck,
              playerTwoHand: playerTwoHand
            }).then(_ => FirebaseSuccess(doc.id))
              .catch(err => FirebaseFailure<string>(err))
          }).catch(err => FirebaseFailure<string>(err))
        }).catch(err => FirebaseFailure<string>(err))
    }
  }).catch(err => FirebaseFailure<string>(err))
})
