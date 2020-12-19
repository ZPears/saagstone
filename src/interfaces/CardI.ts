export default interface CardI {
  cardId: string,
  cardName: string,
  baseAttack: number,
  baseHealth: number,
  currentHealth?: number,
  currentAttack?: number
}