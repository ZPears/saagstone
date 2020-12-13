import React from "react";
import Image from "./Image";

export interface CardProps {
  imageUrl: string,
  isFlipped: boolean,
  canFlip: boolean,
  onClick: () => void
}

export default function Card(props: CardProps) {
  return (
    <div className="card-container" onClick={props.onClick}>
      <div className={`card${props.isFlipped ? " flipped" : ""}`}>
        <Image className="side front" src={props.imageUrl} alt="" style={{}} />
        <div className="side back" />
      </div>
    </div>
  )
}