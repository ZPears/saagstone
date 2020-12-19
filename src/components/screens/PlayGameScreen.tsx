import React, { useRef, useContext, useEffect, useState } from "react";
import { Card } from 'react-bootstrap';
import { GameContext, GameScreen } from '../../contexts/GameContext';
import GameI from "../../interfaces/GameI";
import * as FirebaseService from './../../services/FirebaseService';

export default function PlayGameScreen() {

  const [gameState, setGameState] = useState<GameI>();

  const gameContext = useRef(useContext(GameContext));

  useEffect(() => {
    if (gameContext.current.gameId &&
      gameContext.current.currentScreen === GameScreen.PLAYGAME) {
      FirebaseService.GetActiveGameRef(gameContext.current.gameId)
        .onSnapshot(doc => setGameState(doc.data() as GameI))
    }
  }, [gameState, gameContext]);

  return (
    <Card className="page-centered">
      <Card.Body className="card-grid">
        <h3>You are playing game {gameState?.gameId} as {gameState?.playerOneAlias}</h3>
      </Card.Body>
    </Card>
  )
}