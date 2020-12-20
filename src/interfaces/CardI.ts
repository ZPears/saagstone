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