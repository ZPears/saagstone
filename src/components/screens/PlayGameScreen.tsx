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

  function FaceUpCard(cardData: CardI) {
    return (
      <div className="face-up-card">
        <p>Name: {cardData.cardName}</p>
        <p>Attack: {cardData.baseAttack}</p>
        <p>Health: {cardData.baseHealth}</p>
        <p>Type: {cardData.cardType}</p>
        <p>Cost: {cardData.manaCost}</p>
      </div>
    )
  }

  function FaceDownCard(cardData: CardI) {
    return <div className="face-down-card"></div>
  }

  function playerIsPlayerOne(): boolean | undefined {
    return gameState?.playerOneAlias === gameContext.playerName;
  }

  // TODO: Pass in context here of what player you are (one or two)
  // TODO: Spell cards should have a target as part of their data structure.
  //       That way they can start off targeting the right part of the board.
  return (
    <Card className="play-game-screen">
      <Card.Body>
        <Container fluid>
          <Row xs={3} md={3} lg={3} className="gameboard-header">
            <Col><b>Game Id:</b> {gameState?.gameId}</Col>
            <Col><b>Player One</b>: {gameState?.playerOneAlias}{"  "}
              <b>Mana:</b> {gameState?.playerOneMana}{"  "}
              <b>Deck Size:</b>{gameState?.playerOneDeck?.length}</Col>
            <Col><b>Player Two</b>: {gameState?.playerTwoAlias}{"  "}
              <b>Mana:</b> {gameState?.playerTwoMana}{"  "}
              <b>Deck Size:</b>{gameState?.playerTwoDeck?.length}</Col>
          </Row>
          <Row xs={10} md={10} lg={10} className="gameboard-section">
            {playerIsPlayerOne() ?
              gameState?.playerTwoHand?.map(c => FaceDownCard(c)) :
              gameState?.playerOneHand?.map(c => FaceDownCard(c))}
          </Row>
          <Row xs={10} md={10} lg={10} className="gameboard-section">
            {playerIsPlayerOne() ?
              gameState?.playerTwoBoard?.map(c => FaceUpCard(c)) :
              gameState?.playerOneBoard?.map(c => FaceUpCard(c))}
          </Row>
          <Row xs={10} md={10} lg={10} className="gameboard-section">
            {playerIsPlayerOne() ?
              gameState?.playerOneBoard?.map(c => FaceUpCard(c)) :
              gameState?.playerTwoBoard?.map(c => FaceUpCard(c))}
          </Row>
          <Row xs={10} md={10} lg={10} className="gameboard-section">
            {playerIsPlayerOne() ?
              gameState?.playerOneHand?.map(c => FaceUpCard(c)) :
              gameState?.playerTwoHand?.map(c => FaceUpCard(c))}
          </Row>
        </Container>
      </Card.Body>
    </Card>
  )
}