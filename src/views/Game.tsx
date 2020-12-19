import React from 'react';
import JoinGameScreen from '../components/screens/JoinGameScreen';
import PlayGameScreen from '../components/screens/PlayGameScreen';
import { GameContext } from '../contexts/GameContext';

export default function Game() {
  return (
    <GameContext.Consumer>{gameState =>
      gameState.gameId === "" ?
        <JoinGameScreen /> :
        <PlayGameScreen />
    }
    </GameContext.Consumer>
  )
}