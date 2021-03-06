import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import DocumentData = admin.firestore.DocumentData;
import QuerySnapshot = admin.firestore.QuerySnapshot;
import QueryDocumentSnapshot = admin.firestore.QueryDocumentSnapshot;

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

export interface CardI {
  cardId: string,
  cardName: string,
  cardType: CardType,
  baseAttack: number,
  baseHealth: number,
  manaCost: number,
  currentHealth?: number,
  currentAttack?: number,
}
// ALSO CHANGE IN ../src/interfaces/CardI.ts

// ALSO CHANGE IN ../src/interfaces/GameI.ts
export interface GameI {
  gameId: string,
  playerOnesTurn: boolean,
  playerOneAlias: string,
  playerOneHand?: CardI[],
  playerOneDeck?: CardI[],
  playerOneBoard?: CardI[],
  playerOneMana: number;
  playerTwoAlias?: string,
  playerTwoHand?: CardI[],
  playerTwoDeck?: CardI[],
  playerTwoBoard?: CardI[],
  playerTwoMana: number;
}
// ALSO CHANGE IN ../src/interfaces/GameI.ts



const DECK_SIZE = 30;

const db = admin.firestore();

// n integers in the interval[0, 1)
function randomIdxs(max: number, n: number) {
  return Array.from(Array(n).keys())
    .map(_ => Math.floor(Math.random() * Math.floor(max)))
}

function randomShuffle<T>(a: T, b: T) {
  return Math.random() - 0.5;
}

function randomDeck(cards: QueryDocumentSnapshot<DocumentData>[]):
  Map<QueryDocumentSnapshot<DocumentData>, number> {
  return randomIdxs(cards.length, DECK_SIZE)
    .map(idx => cards[idx])
    .reduce((deck: Map<QueryDocumentSnapshot<DocumentData>, number>,
      cardId: QueryDocumentSnapshot<DocumentData>) => {
      if (deck.get(cardId)) { deck.set(cardId, deck.get(cardId)! + 1) }
      else { deck.set(cardId, 1) }
      return deck;
    }, new Map<QueryDocumentSnapshot<DocumentData>, number>());
}


// API FUNCTIONS
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
      return db.collection("cards").get()
        .then((cardsSnapshot: QuerySnapshot<DocumentData>) => {
          // TODO: Have two different decks per player.
          const deck: Map<QueryDocumentSnapshot<DocumentData>, number> =
            randomDeck(cardsSnapshot.docs);

          const deckCards: CardI[] =
            Array.from(deck.entries()).flatMap(([k, v]) => {
              return Array(v).fill(k.data()! as CardI);
            });

          let playerOneDeck = [...deckCards].sort(randomShuffle);
          let playerTwoDeck = [...deckCards].sort(randomShuffle);
          const playerOneHand = playerOneDeck.splice(0, 4);
          const playerTwoHand = playerTwoDeck.splice(0, 4);
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
            .catch(err =>
              FirebaseFailure<string>(`Game Write Failure: ${err.toString()}`))
        }).catch(err =>
          FirebaseFailure<string>(`Fetch cards failure: ${err.toString()}`))
    }
  }).catch(err =>
    FirebaseFailure<string>(`Total failure: ${err.toString()}`))
})

export const joinGame = functions.https.onCall((data) => {
  if (data.gameId === undefined) {
    return FirebaseFailure("No gameId provided.")
  }
  if (data.playerAlias === undefined) {
    return FirebaseFailure("No playerAlias provided.")
  }

  const gameDocRef = db.collection("activeGames").doc(data.gameId);

  return gameDocRef.get().then(doc => {
    if (!doc.exists) {
      return FirebaseFailure<string>(
        `No game with ID ${data.gameId} exists!`
      );
    } else {
      const game = doc.data()! as GameI;
      if (game.playerOneAlias === data.playerAlias ||
        game.playerTwoAlias === data.playerAlias) {
        return FirebaseSuccess<string>(game.gameId);
      }
      else if (game.playerTwoAlias) {
        return FirebaseFailure<string>(
          `No player slots available in game ${data.gameId}`);
      } else {
        gameDocRef.update({ "playerTwoAlias": data.playerAlias })
        return FirebaseSuccess<string>(game.gameId);
      }
    }
  })
})

export const playCardFromHand = functions.https.onCall((data) => {
  if (!data.gameId) {
    return FirebaseFailure("No gameId provided.")
  }
  if (!data.isPlayerOne) {
    return FirebaseFailure("No player number specified.");
  }
  if (!data.newBoard) {
    return FirebaseFailure("No new board state provided.");
  }
  if (!data.newHand) {
    return FirebaseFailure("No new hand state provided.");
  }

  const gameDocRef = db.collection("activeGames").doc(data.gameId);

  return gameDocRef.get().then(doc => {
    if (!doc.exists) {
      return FirebaseFailure<string>(
        `No game with ID ${data.gameId} exists!`
      );
    } else {
      const handStr = data.isPlayerOne ? "playerOneHand" : "playerTwoHand";
      const boardStr = data.isPlayerOne ? "playerOneBoard" : "playerTwoBoard";
      return gameDocRef.update({
        [handStr]: data.newHand,
        [boardStr]: data.newBoard
      }).then(_ => FirebaseSuccess<string>("OK"))
        .catch(err => FirebaseFailure("PlayCard update failed."))
    }
  })
})