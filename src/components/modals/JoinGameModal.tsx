import React, { useEffect, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import Keyboard from './../../utils/Keyboard';
import { keyNameForPicadeInput, PicadeInput } from '../../picade/PicadeInputs';

export default function JoinGameModal() {

  const [newGameHighlighted, setNewGameHighlighted] = useState<boolean>(true);
  const [newGameSelected, setNewGameSelected] = useState<boolean>(false);
  const [joinGameSelected, setJoinGameSelected] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(`keycode ${event.keyCode}, ${event.key} prseed`);
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
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [newGameHighlighted, newGameSelected, joinGameSelected]);

  function JoinMenu() {
    return (
      <Card.Body className="card-grid">
        <Button variant={newGameHighlighted ? "success" : "secondary"} className="grid-elem1 grid-button">
          Start New Game
        </Button>
        <Button variant={!newGameHighlighted ? "success" : "secondary"} className="grid-elem2 grid-button">
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
            <Form.Label>Your Alias</Form.Label>
            <Form.Control required type="textarea"></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Your Alias</Form.Label>
            <Form.Control required type="textarea"></Form.Control>
          </Form.Group>
        </Form>
        <Keyboard />
      </Card.Body>
    )
  }

  return (
    <Card className="page-centered">
      {!(newGameSelected || joinGameSelected) ? JoinMenu() : GameSelector()}
    </Card>
  )
}