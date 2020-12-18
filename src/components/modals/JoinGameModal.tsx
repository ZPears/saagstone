import React, { useEffect, useState } from 'react';
import Keyboard from 'react-simple-keyboard';
import { Button, Card } from 'react-bootstrap';
import keyCodeForPicadeInput, { PicadeInput } from '../../picade/PicadeInputs';

export default function JoinGameModal() {

  const [newGameSelected, setNewGameSelected] = useState<boolean>(true);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      }
    }
  }, [newGameSelected]);

  return (
    <Card>
      <Card.Body>
        <Button variant="success" className="menu-button">
          Start New Game
            </Button>
        <Button variant="success">
          Join Existing Game
        </Button>
        <Keyboard>

        </Keyboard>
      </Card.Body>
    </Card>
  )
}