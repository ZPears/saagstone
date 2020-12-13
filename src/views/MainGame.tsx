import React, { useEffect, useState } from 'react';

export default function MainGame() {

  const [keyCode, setKeyCode] = useState<number>(0);

  const handleKeyDown = (event: KeyboardEvent) => {
    setKeyCode(event.keyCode);
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  return (
    <div><h1>The Main Game</h1>
      <p>The pressed keycode: {keyCode}</p></div>
  )
}