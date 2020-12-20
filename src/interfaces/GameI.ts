import CardI from "./CardI";

export default interface GameI {
  gameId: string,
  playerOnesTurn: boolean,
  playerOneAlias: string,
  playerOneHand?: CardI[],
  playerOneBoard?: CardI[],
  playerOneMana: number;
  playerTwoAlias?: string,
  playerTwoHand?: CardI[],
  playerTwoBoard?: CardI[],
  playerTwoMana: number;
}