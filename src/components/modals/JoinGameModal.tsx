import React, { useEffect, useState } from 'react';
import Keyboard from 'react-simple-keyboard';
import { Button, Card } from 'react-bootstrap';
import keyCodeForPicadeInput, { PicadeInput } from '../../picade/PicadeInputs';

export default function JoinGameModal() {

  const [newGameSelected, setNewGameSelected] = useState<boolean>(true);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(`keycode ${event.keyCode}, ${event.key} prseed`);
      switch (event.keyCode) {
        case keyCodeForPicadeInput(PicadeInput.JOYSTICK_DOWN): {
          if (newGameSelected) { setNewGameSelected(false); }
          break;
        }
        case keyCodeForPicadeInput(PicadeInput.JOYSTICK_UP): {
          if (!newGameSelected) { setNewGameSelected(true); }
          break;
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [newGameSelected]);

  return (
    <Card className="page-centered">
      <Card.Body className="card-grid">
        <Button variant={newGameSelected ? "success" : "secondary"} className="grid-elem1 grid-button">
          Start New Game
        </Button>
        <Button variant={!newGameSelected ? "success" : "secondary"} className="grid-elem2 grid-button">
          Join Existing Game
        </Button>
      </Card.Body>
    </Card>
  )
}