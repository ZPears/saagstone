import React from 'react';
import MainGame from './views/MainGame';
import './scss/App.scss';

// Adapted from https://github.com/svsem/Memorai
export default function App() {
  return (
    <div className="App">
      <MainGame />
    </div>
  );
}