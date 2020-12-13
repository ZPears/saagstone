import React from 'react';

export interface ImageProps {
  src: string,
  alt: string,
  style: object,
  className: string
}

export default function Image(props: ImageProps) {
  return <img src={props.src} alt={props.alt} style={props.style}
    className={props.className} />
}