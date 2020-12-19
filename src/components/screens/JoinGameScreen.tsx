import React, { useEffect, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import Keyboard from '../../utils/Keyboard';
import { keyNameForPicadeInput, PicadeInput } from '../../picade/PicadeInputs';

enum InputState {
  ALIAS,
  GAMECODE,
  WAITING
}

export default function JoinGameScreen() {

  const [newGameHighlighted, setNewGameHighlighted] = useState<boolean>(true);
  const [newGameSelected, setNewGameSelected] = useState<boolean>(false);
  const [joinGameSelected, setJoinGameSelected] = useState<boolean>(false);

  const [alias, setAlias] = useState<string>("");
  const [gameCode, setGameCode] = useState<string>("");
  const [inputState, setInputState] = useState<InputState>(InputState.ALIAS);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case keyNameForPicadeInput(PicadeInput.JOYSTICK_DOWN): {
          if (newGameHighlighted) { setNewGameHighlighted(false); }
          break;
        }
        case keyNameForPicadeInput(PicadeInput.JOYSTICK_UP): {
          if (!newGameHighlighted) { setNewGameHighlighted(true); }
          break;
        }
        case keyNameForPicadeInput(PicadeInput.BUTTON_A): {
          // Ignore input if we're joining or creating a game.
          if (newGameSelected || joinGameSelected) { }
          else if (newGameHighlighted) { setNewGameSelected(true); }
          else { setJoinGameSelected(true); }
          break;
        }
        case keyNameForPicadeInput(PicadeInput.BUTTON_B): {
          if (newGameSelected || joinGameSelected) {
            setNewGameSelected(false);
            setJoinGameSelected(false);
          }
          break;
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [newGameHighlighted, newGameSelected, joinGameSelected]);

  function keyboardCallback(char: string, button: PicadeInput): void {
    switch (button) {
      case PicadeInput.BUTTON_A: {
        switch (inputState) {
          case InputState.ALIAS: { setAlias(`${alias}${char}`); break; }
          case InputState.GAMECODE: { setGameCode(`${gameCode}${char}`); break; }
        }
        break;
      }
      case PicadeInput.BUTTON_X: {
        switch (inputState) {
          case InputState.ALIAS: {
            setAlias(`${alias.substring(0, alias.length)}`); break;
          }
          case InputState.GAMECODE: {
            setGameCode(`${gameCode.substring(0, gameCode.length)}`); break;
          }
        }
        break;
      }
      case PicadeInput.START: {
        switch (inputState) {
          case InputState.ALIAS: { setInputState(InputState.GAMECODE); break; }
          case InputState.GAMECODE: {
            if (newGameSelected) {
              // Create a new game.
            }
            // Join game is selected.
            else {
              // Lookup a game.
            }
          }
        }
      }
    }
  }

  function formInputStyleFor(state: InputState): string {
    return `form-input${inputState === state ? " selected-input" : ""}`;
  }

  function JoinMenu() {
    return (
      <Card.Body className="card-grid">
        <Button variant={newGameHighlighted ? "success" : "secondary"}
          className="grid-elem1 grid-button">
          Start New Game
        </Button>
        <Button variant={!newGameHighlighted ? "success" : "secondary"}
          className="grid-elem2 grid-button">
          Join Existing Game
        </Button>
      </Card.Body>
    )
  }

  function GameSelector() {
    return (
      <Card.Body className="card-grid">
        <Form>
          <Form.Group>
            <Form.Label className={"form-title"}>Your Alias</Form.Label>
            <Form.Control required type="textarea"
              defaultValue={alias}
              className={formInputStyleFor(InputState.ALIAS)} />
          </Form.Group>
          <Form.Group>
            <Form.Label className={"form-title"}>Game Code</Form.Label>
            <Form.Control required type="textarea"
              defaultValue={gameCode}
              className={formInputStyleFor(InputState.GAMECODE)} />
          </Form.Group>
        </Form>
        <Keyboard callback={keyboardCallback} />
        <h3 className="text-centered">
          Press Picade START (or "o" key) to submit!
        </h3>
      </Card.Body>
    )
  }

  return (
    <Card className="page-centered">
      {!(newGameSelected || joinGameSelected) ? JoinMenu() : GameSelector()}
    </Card>
  )
}