import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../App.css";
import * as R from "ramda";

import Board from "./Board";
import GameControls from "./GameControls";
import {
  BOARD_SIZE,
  POSITION_DESCRIPTIONS,
  POSITION_TYPE,
} from "../../constants";
import { useLocalStorage } from "@uidotdev/usehooks";
import QuizPopup from "../popups/QuizPopup";
import InfoPopup from "../popups/InfoPopup";

function Game() {
  // const { id: gameId } = useParams();
  const navigate = useNavigate();

  const [gameId, setGameId] = useLocalStorage("GAME_ID", null);
  const [playerUniqueId, setPlayerUniqueId] = useLocalStorage(
    "PLAYER_UNIQUE_ID",
    null,
  );
  const [playerName, setPlayerName] = useLocalStorage("PLAYER_NAME", null);

  const [position, setPosition] = useState(0);
  const [currentMoves, setCurrentMoves] = useState([]);

  const [lastRoll, setLastRoll] = useState(null);
  const [score, setScore] = useState(0);
  // const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  const [popup, setPopup] = useState(null);

  const handleScore = (game, playerId) => {
    const { players } = game;
    const player = players.find((p) => p.playerUniqueId === playerId);
    if (player) setScore(player.score);
  };

  const takeStep = (move) => {
    const { next } = move;
    setPosition(next);
  };

  const handleRoll = ({ roll, moves, game }) => {
    const { total } = roll;
    setLastRoll(total);

    handleScore(game, playerUniqueId);
    setCurrentMoves(moves);
    takeStep(moves[0]);

    // setIsPlayerTurn(false);
    // setTimeout(() => setIsPlayerTurn(true), 1200);
  };

  const handlePieceArrive = (pos) => {
    const { playerUniqueId, next, nextType, content } = currentMoves[0];
    setCurrentMoves(R.tail(currentMoves));

    if (pos == 90) {
      // for now
      const endgame = {
        title: "Congratulations",
        text: "You have graduated the game!!! 🎓🎓🎓",
      };
      setPopup({ type: POSITION_TYPE.INFO, content: endgame });
    } else if (pos == 0) {
      return;
    } else if (pos === next) {
      // This is the move, check for type
      if (nextType === POSITION_TYPE.CHALLENGE) {
        const { quiz } = content;
        setPopup({ type: POSITION_TYPE.CHALLENGE, content: quiz });
      } else {
        // for now
        const content = {
          title: "Special Box",
          text: POSITION_DESCRIPTIONS[nextType],
        };
        setPopup({ type: POSITION_TYPE.INFO, content });
      }
    }
    // Something wrong here!
  };

  const handleQuit = () => {
    setPosition(0);
    setLastRoll(null);
    setPopup(null);

    setGameId("");
    setPlayerName("");
    setPlayerUniqueId("");
    navigate("/");
  };

  const handleClosePopup = () => {
    setPopup(null);
    currentMoves[0] && takeStep(currentMoves[0]);
    if (position === 90) handleQuit();
  };

  const handleSubmit = (option) => {
    setPopup(null);
    currentMoves[0] && takeStep(currentMoves[0]);
  };

  return (
    <div style={{ padding: 10 }}>
      <Board playerPosition={position} onPieceArrive={handlePieceArrive} />

      <GameControls
        playerName="Player 1"
        isCurrentTurn={true}
        lastRoll={lastRoll}
        points={score}
        onRoll={(total) => handleRoll(total)}
        onQuit={handleQuit}
      />

      <QuizPopup
        open={popup?.type === POSITION_TYPE.CHALLENGE}
        payload={popup?.content}
        onClose={handleClosePopup}
        onSubmit={handleSubmit}
        handleScore={handleScore}
      />
      <InfoPopup
        open={popup?.type === POSITION_TYPE.INFO}
        payload={popup?.content}
        onClose={handleClosePopup}
      />
    </div>
  );
}

export default Game;
