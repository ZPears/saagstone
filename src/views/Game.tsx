import React from 'react';
import JoinGameScreen from '../components/screens/JoinGameScreen';
import PlayGameScreen from '../components/screens/PlayGameScreen';
import { GameContext, GameScreen } from '../contexts/GameContext';

export default function Game() {
  function getGameScreen(screen: GameScreen) {
    switch (screen) {
      case GameScreen.JOINGAME: {
        return <JoinGameScreen />
      }
      case GameScreen.KEYBOARDINPUT: {
        return <JoinGameScreen />
      }
      case GameScreen.PLAYGAME: {
        return <PlayGameScreen />
      }
    }
  }

  return (
    <GameContext.Consumer>{gameState => getGameScreen(gameState.currentScreen)}
    </GameContext.Consumer>
  )
}