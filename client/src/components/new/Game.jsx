import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../App.css";

import Board from "./Board";
import GameControls from "./GameControls";
import Popup from "./Popup";
import { BOARD_SIZE } from "../../constants";

function Game() {
  const { id: gameId } = useParams();
  const navigate = useNavigate();

  const [position, setPosition] = useState(1);
  const [lastRoll, setLastRoll] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  // popup: null or { type, payload }
  const [popup, setPopup] = useState(null);

  const handleRoll = (total) => {
    console.log(total);
    if (!isPlayerTurn) return;

    setLastRoll(total);
    // setPosition((prev) => Math.min(prev + total, BOARD_SIZE));
    setPosition((prev) => {
      const next = prev + total;
      if (next > BOARD_SIZE) return BOARD_SIZE - (next - BOARD_SIZE);
      return next;
    });

    setIsPlayerTurn(false);
    setTimeout(() => setIsPlayerTurn(true), 1200);
  };

  // inside Game component
  const handlePieceArrive = (pos) => {
    const shouldPopup = true; // Decide if pop-up should open
    if (shouldPopup) setPopup(shouldPopup);
  };

  const handleQuit = () => {
    setPosition(0);
    setLastRoll(null);
    setPopup(null);
    navigate("/");
  };

  const handleClosePopup = () => {
    setPopup(null);
  };

  const handleAnswer = (option) => {
    // very simple feedback flow
    if (option.correct) {
      alert("Correct! You earn a bonus.");
      // optionally modify state (points, move, etc.)
    } else {
      alert("Not quite. Better luck next time.");
    }
    setPopup(null);
  };

  return (
    <div style={{ padding: 10 }}>
      {/* <h2>Game ID:{id}</h2> */}
      <Board playerPosition={position} onPieceArrive={handlePieceArrive} />

      <GameControls
        playerName="Player 1"
        isCurrentTurn={isPlayerTurn}
        lastRoll={lastRoll}
        onRoll={(total) => handleRoll(total)}
        onQuit={handleQuit}
      />

      <Popup
        open={!!popup}
        type={popup?.type}
        payload={popup?.payload}
        onClose={handleClosePopup}
        onAnswer={handleAnswer}
      />
    </div>
  );
}

export default Game;
