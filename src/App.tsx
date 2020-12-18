import React, { useState } from 'react';
import LoginScreen from './views/LoginScreen';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import { GameContext } from './contexts/GameContext';
import './scss/App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-simple-keyboard/build/css/index.css';

export default function App() {
  const [gameId, setGameId] = useState<string>("");
  const [playerName, setPlayerName] = useState<string>("");

  return (
    <div className="App"
      style={
        {
          backgroundImage:
            `${process.env.PUBLIC_URL}/static/images/background_image.png`
        }}>
      <GameContext.Provider value={{
        gameId: gameId,
        setGameId: setGameId,
        playerName: playerName,
        setPlayerName: setPlayerName
      }}>
        <BrowserRouter>
          <Route path="/" exact component={LoginScreen} />
          <Route render={() => <Redirect to="/" />} />
        </BrowserRouter>
      </GameContext.Provider>
    </div>
  );
}