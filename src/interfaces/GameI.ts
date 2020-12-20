import CardI from "./CardI";

export default interface GameI {
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