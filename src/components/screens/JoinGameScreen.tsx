import React, { useContext, useEffect, useState } from 'react';
import { Badge, Button, Card, Form } from 'react-bootstrap';
import Keyboard from '../../utils/Keyboard';
import * as FirebaseService from './../../services/FirebaseService';
import { keyNameForPicadeInput, PicadeInput } from '../../picade/PicadeInputs';
import { GameContext, GameScreen } from '../../contexts/GameContext';

enum InputState {
  ALIAS,
  GAMECODE
}

export default function JoinGameScreen() {

  const [newGameHighlighted, setNewGameHighlighted] = useState<boolean>(true);
  const [newGameSelected, setNewGameSelected] = useState<boolean>(false);
  const [joinGameSelected, setJoinGameSelected] = useState<boolean>(false);

  const [alias, setAlias] = useState<string>("");
  const [gameCode, setGameCode] = useState<string>("");
  const [inputState, setInputState] = useState<InputState>(InputState.ALIAS);

  const [message, setMessage] = useState<string>("");
  const [messageVis, setMessageVis] = useState<"visible" | "hidden">("hidden");

  const gameContext = useContext(GameContext);

  async function showErrorMessage(msg: string) {
    setMessage(msg);
    setMessageVis("visible");
    return new Promise(_ => {
      setTimeout(() => {
        setMessageVis("hidden");
        setMessage("");
      }, 3000);
    });
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameContext.currentScreen === GameScreen.JOINGAME) {
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
            gameContext.setCurrentScreen(GameScreen.JOINGAME_KEYBOARDINPUT);
            if (newGameHighlighted) { setNewGameSelected(true); }
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
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [newGameHighlighted, newGameSelected, joinGameSelected, gameContext]);

  function keyboardCallback(char: string, button: PicadeInput): void {
    switch (button) {
      case PicadeInput.BUTTON_A: {
        switch (inputState) {
          case InputState.ALIAS: { setAlias(`${alias}${char}`); break; }
          case InputState.GAMECODE: {
            setGameCode(`${gameCode}${char}`); break;
          }
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
              gameContext.setCurrentScreen(GameScreen.JOINGAME);
              FirebaseService.CreateGame(gameCode, alias).then(r => {
                switch (r.status) {
                  case FirebaseService.FirebaseServiceStatus.SUCCESS: {
                    gameContext.setGameId(r.response!);
                    gameContext.setCurrentScreen(GameScreen.PLAYGAME);
                    break;
                  }
                  case FirebaseService.FirebaseServiceStatus.FAILURE: {
                    // This error message doesn't work because
                    // it unmounts this and then it remounts as the default,
                    // after coming back from the loading page.
                    gameContext
                      .setCurrentScreen(GameScreen.JOINGAME);
                    setInputState(InputState.ALIAS);
                    setAlias("");
                    setGameCode("");
                    showErrorMessage(r.message);
                    break;
                  }
                }
              })
            }
            // Join game is selected.
            else {
              // TODO: implement game joining
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
      </Card.Body >
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
        <Keyboard callback={keyboardCallback}
          previousScreen={GameScreen.JOINGAME} />
        <h3 className="text-centered">
          Press Picade START (or "o" key) to submit!
        </h3>
      </Card.Body >
    )
  }

  return (
    <Card className="join-game-screen">
      <h2>
        <Badge variant="danger" style={{ visibility: messageVis }}>
          {message}
        </Badge>
      </h2>
      {!(newGameSelected || joinGameSelected) ? JoinMenu() : GameSelector()}
    </Card>
  )
}