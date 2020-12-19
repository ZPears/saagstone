import React, { useState } from 'react';
import Game from './views/Game';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import { GameContext, GameScreen } from './contexts/GameContext';
import './scss/App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  // TODO: Make this one state that's a GameState
  const [gameId, setGameId] = useState<string | undefined>(undefined);
  const [playerName, setPlayerName] = useState<string>("");
  const [currentScreen, setCurrentScreen] =
    useState<GameScreen>(GameScreen.JOINGAME);

  return (
    <div className="App">
      <GameContext.Provider value={{
        gameId: gameId,
        setGameId: setGameId,
        playerName: playerName,
        setPlayerName: setPlayerName,
        currentScreen: currentScreen,
        setCurrentScreen: setCurrentScreen
      }}>
        <BrowserRouter>
          <Route path="/" exact component={Game} />
          <Route render={() => <Redirect to="/" />} />
        </BrowserRouter>
      </GameContext.Provider>
    </div>
  );
}