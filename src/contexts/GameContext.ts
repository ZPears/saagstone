import React from 'react';

// Used in UseEffects to check what screen we're on,
// and therefore whether the event listeners should trigger.
export enum GameScreen {
  JOINGAME,
  KEYBOARDINPUT,
  PLAYGAME
}

export interface GameState {
  gameId: string,
  setGameId: (gameId: string) => void
  playerName: string,
  setPlayerName: (playerName: string) => void,
  currentScreen: GameScreen,
  setCurrentScreen: (screen: GameScreen) => void
}

const defaultGameState = {
  gameId: "",
  setGameId: (gameId: string) => { },
  playerName: "",
  setPlayerName: (playerName: string) => { },
  currentScreen: GameScreen.JOINGAME,
  setCurrentScreen: (screen: GameScreen) => { }
}

export const GameContext: React.Context<GameState> =
  React.createContext(defaultGameState);