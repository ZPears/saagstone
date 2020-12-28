import React, { useContext, useEffect, useState } from "react";
import { Card, Col, Container, Row } from 'react-bootstrap';
import { GameContext, GameScreen } from '../../contexts/GameContext';
import GameI from "../../interfaces/GameI";
import CardI from "../../interfaces/CardI";
import { keyNameForPicadeInput, PicadeInput } from '../../picade/PicadeInputs';
import * as FirebaseService from './../../services/FirebaseService';

interface SelectedCard {
  xIdx: number,
  yIdx: number, // 0 is hand, 1 is board
}

export default function PlayGameScreen() {

  const [gameState, setGameState] = useState<GameI>();
  const [cursorX, setCursorX] = useState<number>(0);
  const [cursorY, setCursorY] = useState<number>(0);

  const [selectedCard, setSelectedCard] =
    useState<SelectedCard | undefined>(undefined);

  const gameContext = useContext(GameContext);

  useEffect(() => {
    if (gameContext.gameId &&
      gameContext.currentScreen === GameScreen.PLAYGAME) {
      FirebaseService.GetActiveGameRef(gameContext.gameId)
        .onSnapshot(doc => setGameState(doc.data() as GameI))
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameContext.currentScreen === GameScreen.PLAYGAME) {
        switch (event.key) {
          case keyNameForPicadeInput(PicadeInput.JOYSTICK_LEFT): {
            setCursorX(Math.max(0, cursorX - 1));
            break;
          }
          case keyNameForPicadeInput(PicadeInput.JOYSTICK_RIGHT): {
            const maxRight: number | undefined = maxRightValue();
            if (maxRight) { setCursorX(Math.min(maxRight - 1, cursorX + 1)) };
            break;
          }
          case keyNameForPicadeInput(PicadeInput.BUTTON_A): {
            if (!selectedCard) {
              setSelectedCard({ xIdx: cursorX, yIdx: cursorY })
              if (cursorY === 0) {
                setCursorY(1);
              }
            } else {
              if (cursorY === 1 && selectedCard.yIdx === 0) {
                PlayCardFromHand(selectedCard.xIdx);
              }
            }
          }
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [gameState, gameContext]);

  function PlayCardFromHand(cardIdx: number) {
    const isPlayerOne = playerIsPlayerOne();
    if (gameState && gameState.playerOneHand && gameState.playerTwoHand) {
      // TODO: Check board size.
      const maybeBoard = isPlayerOne ? gameState.playerOneBoard : gameState.playerTwoBoard;
      // TODO: Play cards somewhere based on user choice.
      let newBoard: CardI[] = maybeBoard ? [...maybeBoard!] : [];
      let newHand: CardI[] = isPlayerOne ?
        [...gameState.playerOneHand] : [...gameState.playerTwoHand];
      newBoard.push(newHand[cardIdx]);
      newHand.splice(cardIdx, 1);
      FirebaseService.playCardFromHand(isPlayerOne, newBoard, newHand);
    } else {
      // TODO: Show some error about how the game state is invalid.
    }
  }

  function FaceUpCard(cardData: CardI, cardIdx: number, rowNumber: number) {
    const classes: string =
      `face-up-card${cardIdx === cursorX && rowNumber === cursorY ?
        " card-highlighted" : ""}`
    return (
      <div className={classes}>
        <p>Name: {cardData.cardName}</p>
        <p>Attack: {cardData.baseAttack}</p>
        <p>Health: {cardData.baseHealth}</p>
        <p>Type: {cardData.cardType}</p>
        <p>Cost: {cardData.manaCost}</p>
      </div>
    )
  }

  function FaceDownCard(cardData: CardI, cardIdx: number, rowNumber: number) {
    const classes: string =
      `face-down-card${cardIdx === cursorX && rowNumber === cursorY ?
        " card-highlighted" : ""}`
    return <div className={classes}></div>
  }

  function playerIsPlayerOne(): boolean | undefined {
    return gameState?.playerOneAlias === gameContext.playerName;
  }

  function maxRightValue(): number | undefined {
    // Player hand selected
    if (cursorY === 0) {
      return playerIsPlayerOne() ?
        gameState?.playerOneHand?.length :
        gameState?.playerTwoHand?.length;
    } else {
      // TODO: handle board selection
      return undefined;
    }
  }

  function GameboardSectionStyle(rowIdx: number): string {
    return `gameboard-section${cursorY === rowIdx ? " section-selected" : ""}`
  }

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
          <Row xs={10} md={10} lg={10} className={GameboardSectionStyle(3)}>
            {playerIsPlayerOne() ?
              gameState?.playerTwoHand?.map((c, i) => FaceDownCard(c, i, 3)) :
              gameState?.playerOneHand?.map((c, i) => FaceDownCard(c, i, 3))}
          </Row>
          <Row xs={10} md={10} lg={10} className={GameboardSectionStyle(2)}>
            {playerIsPlayerOne() ?
              gameState?.playerTwoBoard?.map((c, i) => FaceUpCard(c, i, 2)) :
              gameState?.playerOneBoard?.map((c, i) => FaceUpCard(c, i, 2))}
          </Row>
          <Row xs={10} md={10} lg={10} className={GameboardSectionStyle(1)}>
            {playerIsPlayerOne() ?
              gameState?.playerOneBoard?.map((c, i) => FaceUpCard(c, i, 1)) :
              gameState?.playerTwoBoard?.map((c, i) => FaceUpCard(c, i, 1))}
          </Row>
          <Row xs={10} md={10} lg={10} className={GameboardSectionStyle(0)}>
            {playerIsPlayerOne() ?
              gameState?.playerOneHand?.map((c, i) => FaceUpCard(c, i, 0)) :
              gameState?.playerTwoHand?.map((c, i) => FaceUpCard(c, i, 0))}
          </Row>
        </Container>
      </Card.Body>
    </Card>
  )
}