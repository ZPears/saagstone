import React, { useContext, useEffect, useState } from "react";
import { Card, Col, Container, Row } from 'react-bootstrap';
import { GameContext, GameScreen } from '../../contexts/GameContext';
import GameI from "../../interfaces/GameI";
import CardI from "../../interfaces/CardI";
import * as FirebaseService from './../../services/FirebaseService';

export default function PlayGameScreen() {

  const [gameState, setGameState] = useState<GameI>();

  const gameContext = useContext(GameContext);

  useEffect(() => {
    if (gameContext.gameId &&
      gameContext.currentScreen === GameScreen.PLAYGAME) {
      FirebaseService.GetActiveGameRef(gameContext.gameId)
        .onSnapshot(doc => setGameState(doc.data() as GameI))
    }
  }, [gameState, gameContext]);

  function GameCard(cardData: CardI) {
    return <div><p>Card: {cardData.cardName}</p></div>
  }

  return (
    <Card className="play-game-screen">
      <Card.Body>
        <Container fluid>
          <Row xs={3} md={3} lg={3} className="gameboard-header">
            <Col><b>Game Id:</b> {gameState?.gameId}</Col>
            <Col><b>Player One</b>: {gameState?.playerOneAlias}</Col>
            <Col><b>Player Two</b>: {gameState?.playerTwoAlias}</Col>
          </Row>
          <Row xs={10} md={10} lg={10} className="gameboard-section">
            {gameState?.playerTwoHand?.map(c => GameCard(c))}
          </Row>
          <Row xs={10} md={10} lg={10} className="gameboard-section">
            {gameState?.playerTwoBoard?.map(c => GameCard(c))}
          </Row>
          <Row xs={10} md={10} lg={10} className="gameboard-section">
            {gameState?.playerOneBoard?.map(c => GameCard(c))}
          </Row>
          <Row xs={10} md={10} lg={10} className="gameboard-section">
            {gameState?.playerOneHand?.map(c => GameCard(c))}
          </Row>
        </Container>
      </Card.Body>
    </Card>
  )
}