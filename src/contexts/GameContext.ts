import React from 'react';

export interface GameState {
  gameId: string,
  setGameId: (gameId: string) => void
  playerName: string,
  setPlayerName: (playerName: string) => void
}

const defaultGameState = {
  gameId: "",
  setGameId: (gameId: string) => { },
  playerName: "",
  setPlayerName: (playerName: string) => { }
}

export const GameContext: React.Context<GameState> =
  React.createContext(defaultGameState);