import React, { useState } from 'react';
import Game from './views/Game';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import { GameContext } from './contexts/GameContext';
import './scss/App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const [gameId, setGameId] = useState<string>("");
  const [playerName, setPlayerName] = useState<string>("");

  return (
    <div className="App">
      <GameContext.Provider value={{
        gameId: gameId,
        setGameId: setGameId,
        playerName: playerName,
        setPlayerName: setPlayerName
      }}>
        <BrowserRouter>
          <Route path="/" exact component={Game} />
          <Route render={() => <Redirect to="/" />} />
        </BrowserRouter>
      </GameContext.Provider>
    </div>
  );
}