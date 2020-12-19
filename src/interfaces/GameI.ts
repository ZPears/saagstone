import CardI from "./CardI";

export default interface GameI {
  gameId: string,
  playerOneAlias: string,
  playerOneHand?: CardI[],
  playerOneBoard?: CardI[],
  playerTwoAlias?: string,
  playerTwoHand?: CardI[],
  playerTwoBoard?: CardI[]
}