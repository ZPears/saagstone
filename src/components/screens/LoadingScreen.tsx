import React from 'react';
import { Card, Spinner } from 'react-bootstrap';

export default function LoadingScreen() {
  return (
    <Card className="join-game-screen">
      <Card.Body className="card-grid">
        <h3 className="text-centered">Loading...</h3>
        <div className="d-flex justify-content-center">
          <Spinner animation="border" />
        </div>
      </Card.Body>
    </Card>
  )
}