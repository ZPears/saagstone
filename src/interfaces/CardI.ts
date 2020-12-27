export type CardType = "minion" | "spell";

// ALSO CHANGE IN ../../functions
export default interface CardI {
  cardId: string,
  cardName: string,
  cardType: CardType,
  baseAttack: number,
  baseHealth: number,
  manaCost: number,
  currentHealth?: number,
  currentAttack?: number,
}
// ALSO CHANGE IN ../../functions