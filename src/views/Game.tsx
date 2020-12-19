import React from 'react';
import JoinGameScreen from '../components/screens/JoinGameScreen';
import LoadingScreen from '../components/screens/LoadingScreen';
import PlayGameScreen from '../components/screens/PlayGameScreen';
import { GameContext, GameScreen } from '../contexts/GameContext';

export default function Game() {
  function getGameScreen(screen: GameScreen) {
    switch (screen) {
      case GameScreen.LOADING: {
        return <LoadingScreen />
      }
      case GameScreen.JOINGAME: {
        return <JoinGameScreen />
      }
      case GameScreen.JOINGAME_KEYBOARDINPUT: {
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