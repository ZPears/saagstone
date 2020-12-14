import React, { useEffect, useState } from 'react';
import uuid from "uuid";
import cardImages from './../utils/CardImages';
import Card from "./../components/Card";

export interface CardInfo {
  id: string,
  imageUrl: string,
  isFlipped: boolean,
  canFlip: boolean
}

function shuffleArray<T>(array: Array<T>): Array<T> {
  return array.sort(() => .5 - Math.random());
}

function generateCards(numCards: number): Array<CardInfo> {
  if (numCards % 2 !== 0) {
    throw `Count must be even, but numCards was ${numCards}`
  }

  const cards = shuffleArray(cardImages)
    .slice(0, numCards / 2)
    .map(cardImage => ({
      id: uuid.v4().toString(),
      imageUrl: `${process.env.PUBLIC_URL}/static/images/cards/${cardImage}`,
      isFlipped: false,
      canFlip: true
    }))
    .flatMap(cardInfo =>
      [cardInfo,
        { ...JSON.parse(JSON.stringify(cardInfo)), id: uuid.v4().toString() }]
    )

  return shuffleArray(cards);
}

export default function MainGame() {
  const totalCards = 18;

  // REMOVE
  const [keyCode, setKeyCode] = useState<number>(0);
  // useEffect(() => {
  //   window.addEventListener('keydown', handleKeyDown);
  //   return () => {
  //     window.removeEventListener('keydown', handleKeyDown);
  //   }
  // }, []);

  const [cards, setCards] =
    useState<Array<CardInfo>>(generateCards(totalCards));
  const [canFlip, setCanFlip] = useState<boolean>(false);
  const [firstCard, setFirstCard] = useState<CardInfo | null>(null);
  const [secondCard, setSecondCard] = useState<CardInfo | null>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    setKeyCode(event.keyCode);
  }

  function setCardIsFlipped(cardId: string, isFlipped: boolean) {
    setCards(prev => prev.map(c => {
      if (c.id !== cardId) { return c; }
      else { return { ...c, isFlipped } };
    }))
  }

  function setCardCanFlip(cardId: string, canFlip: boolean) {
    setCards(prev => prev.map(c => {
      if (c.id !== cardId) { return c; }
      else { return { ...c, canFlip } };
    }))
  }

  function resetFirstAndSecondCards() {
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
            canFlip={card.canFlip} onClick={() => onCardClick(card)} />
        })}
      </div>
    </div>
  )
}