import React, { useEffect, useState, useRef, useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { keyNameForPicadeInput, PicadeInput } from './../picade/PicadeInputs';
import { GameContext, GameScreen } from '../contexts/GameContext';

interface KeyboardProps {
  callback: (char: string, button: PicadeInput) => void,
  previousScreen: GameScreen
}

const firstRow = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const secondRow = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const thirdRow = ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"];
const fourthRow = ["z", "x", "c", "v", "b", "n", "m", "<", ">", "?"];

const keyRows = [firstRow, secondRow, thirdRow, fourthRow];

export default function Keyboard(props: KeyboardProps) {

  const [selectedRowIdx, setSelectedRowIdx] = useState<number>(0);
  const [selectedColIdx, setSelectedColIdx] = useState<number>(0);

  const gameContext = useRef(useContext(GameContext));

  // TODO: figure out why I can't repeat a character selection.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameContext.current.currentScreen === GameScreen.KEYBOARDINPUT) {
        switch (event.key) {
          case keyNameForPicadeInput(PicadeInput.JOYSTICK_DOWN): {
            setSelectedRowIdx(Math.min(3, selectedRowIdx + 1));
            break;
          }
          case keyNameForPicadeInput(PicadeInput.JOYSTICK_UP): {
            setSelectedRowIdx(Math.max(0, selectedRowIdx - 1));
            break;
          }
          case keyNameForPicadeInput(PicadeInput.JOYSTICK_LEFT): {
            setSelectedColIdx(Math.max(0, selectedColIdx - 1));
            break;
          }
          case keyNameForPicadeInput(PicadeInput.JOYSTICK_RIGHT): {
            setSelectedColIdx(Math.min(9, selectedColIdx + 1));
            break;
          }
          case keyNameForPicadeInput(PicadeInput.BUTTON_A): {
            props.callback(keyRows[selectedRowIdx][selectedColIdx],
              PicadeInput.BUTTON_A);
            break;
          }
          case keyNameForPicadeInput(PicadeInput.BUTTON_B): {
            gameContext.current.setCurrentScreen(props.previousScreen);
            break;
          }
          case keyNameForPicadeInput(PicadeInput.BUTTON_X): {
            props.callback(keyRows[selectedRowIdx][selectedColIdx],
              PicadeInput.BUTTON_X);
            break;
          }
          case keyNameForPicadeInput(PicadeInput.START): {
            props.callback(keyRows[selectedRowIdx][selectedColIdx],
              PicadeInput.START);
            break;
          }
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedRowIdx, selectedColIdx, props, gameContext]);

  function Key(value: string, row: number, col: number) {
    return <Col key={value}
      className={
        `keyboard-key${selectedRowIdx === row && selectedColIdx === col ?
          " selected-key" : ""}`}>{value}</Col>

  }

  return (
    <Container>
      <Row xs={10} md={10} lg={10}>
        {firstRow.map((c, idx) => Key(c, 0, idx))}
      </Row>
      <Row xs={10} md={10} lg={10}>
        {secondRow.map((c, idx) => Key(c, 1, idx))}
      </Row>
      <Row xs={10} md={10} lg={10}>
        {thirdRow.map((c, idx) => Key(c, 2, idx))}
      </Row>
      <Row xs={10} md={10} lg={10}>
        {fourthRow.map((c, idx) => Key(c, 3, idx))}
      </Row>
    </Container>
  )
}