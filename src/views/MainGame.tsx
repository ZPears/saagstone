import React, { useEffect, useState } from 'react';
import uuid from "uuid";
import cardImages from './../utils/CardImages';
import Card from "./../components/Card";
import keyCodeForPicadeInput, { PicadeInput } from '../picade/PicadeInputs';

export interface CardInfo {
  id: string,
  imageUrl: string,
  isFlipped: boolean,
  isSelected: boolean,
  canFlip: boolean
}

function shuffleArray<T>(array: Array<T>): Array<T> {
  return array.sort(() => .5 - Math.random());
}

function generateCards(numCards: number): Array<CardInfo> {
  if (numCards % 2 !== 0) {
    throw `Count must be even, but numCards was ${numCards}`
  }

  const cards: Array<CardInfo> = shuffleArray(cardImages)
    .slice(0, numCards / 2)
    .map(cardImage => ({
      id: uuid.v4().toString(),
      imageUrl: `${process.env.PUBLIC_URL}/static/images/cards/${cardImage}`,
      isFlipped: false,
      canFlip: true,
      isSelected: false
    }))
    .flatMap(cardInfo =>
      [cardInfo,
        { ...JSON.parse(JSON.stringify(cardInfo)), id: uuid.v4().toString() }]
    )

  const shuffled = shuffleArray(cards);

  shuffled[0].isSelected = true;

  return shuffled;
}

export default function MainGame() {
  const columns = 6;
  const rows = 3;
  const totalCards = columns * rows;

  const [cardIdx, setCardIdx] = useState<number>(0);
  const [cards, setCards] =
    useState<Array<CardInfo>>(generateCards(totalCards));
  const [canFlip, setCanFlip] = useState<boolean>(false);
  const [firstCard, setFirstCard] = useState<CardInfo | null>(null);
  const [secondCard, setSecondCard] = useState<CardInfo | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.keyCode) {
        case keyCodeForPicadeInput(PicadeInput.JOYSTICK_UP): {
          if (cardIdx >= columns) {
            const newIdx: number = cardIdx - columns;
            handleSelectionChange(cardIdx, newIdx);
          }
          break;
        }
        case keyCodeForPicadeInput(PicadeInput.JOYSTICK_LEFT): {
          if (cardIdx % columns > 0) {
            const newIdx: number = cardIdx - 1;
            handleSelectionChange(cardIdx, newIdx);
          }
          break;
        }
        case keyCodeForPicadeInput(PicadeInput.JOYSTICK_RIGHT): {
          if (cardIdx % columns < columns - 1) {
            const newIdx: number = cardIdx + 1;
            handleSelectionChange(cardIdx, newIdx);
          }
          break;
        }
        case keyCodeForPicadeInput(PicadeInput.JOYSTICK_DOWN): {
          if (cardIdx < totalCards - columns) {
            const newIdx: number = cardIdx + columns;
            handleSelectionChange(cardIdx, newIdx);
          }
          break;
        }
        case keyCodeForPicadeInput(PicadeInput.BUTTON_A): {
          onCardClick(cards[cardIdx]);
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [cardIdx]);


  function handleSelectionChange(oldIdx: number, newIdx: number): void {
    setCards(prev => prev.map((c, idx) => {
      if (idx === oldIdx) { return { ...c, isSelected: false } }
      else if (idx === newIdx) { return { ...c, isSelected: true } }
      else { return c; }
    }))
    setCardIdx(newIdx);
  }

  function setCardIsFlipped(cardId: string, isFlipped: boolean): void {
    setCards(prev => prev.map(c => {
      if (c.id !== cardId) { return c; }
      else { return { ...c, isFlipped } };
    }))
  }

  function setCardCanFlip(cardId: string, canFlip: boolean): void {
    setCards(prev => prev.map(c => {
      if (c.id !== cardId) { return c; }
      else { return { ...c, canFlip } };
    }))
  }

  function resetFirstAndSecondCards(): void {
    setFirstCard(null);
    setSecondCard(null);
  }

  function onSuccessGuess(): void {
    setCardCanFlip(firstCard!.id, false);
    setCardCanFlip(secondCard!.id, false);
    setCardIsFlipped(firstCard!.id, false);
    setCardIsFlipped(secondCard!.id, false);
    resetFirstAndSecondCards();
  }

  function onFailureGuess(): void {
    setTimeout(() => {
      setCardIsFlipped(firstCard!.id, true);
    }, 1000);
    setTimeout(() => {
      setCardIsFlipped(secondCard!.id, true);
    }, 1200);
    resetFirstAndSecondCards();
  }

  function onCardClick(card: CardInfo): void {
    if (!canFlip || !card.canFlip) { return; }
    if (firstCard && (card.id === firstCard.id)) { return; }
    if (secondCard && (card.id === secondCard.id)) { return; }

    setCardIsFlipped(card.id, false);

    firstCard ? setSecondCard(card) : setFirstCard(card);
  }

  // showcase
  useEffect(() => {
    setTimeout(() => {
      let index = 0;
      for (const card of cards) {
        setTimeout(() => setCardIsFlipped(card.id, true), index++ * 100);
      }
      setTimeout(() => setCanFlip(true), cards.length * 100);
    }, 3000);
  }, []);

  // handle turn
  useEffect(() => {
    if (!firstCard || !secondCard) { return; }
    (firstCard.imageUrl === secondCard.imageUrl) ?
      onSuccessGuess() :
      onFailureGuess();
  }, [firstCard, secondCard]);

  return (
    <div className="game container-md">
      <div className="cards-container">
        {cards.map(card => {
          return <Card imageUrl={card.imageUrl} isFlipped={card.isFlipped}
            canFlip={card.canFlip} onClick={() => onCardClick(card)}
            isSelected={card.isSelected} />
        })}
      </div>
    </div>
  )
}