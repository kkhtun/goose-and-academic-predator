import { useNavigate } from "react-router-dom";
import { apiPost } from "../../api";
import { useState } from "react";
import ShortAnswerPopup from "../popups/ShortAnswerPopup";
import { useLocalStorage } from "@uidotdev/usehooks";

export default function MainMenu() {
  const navigate = useNavigate();
  const [popup, setPopup] = useState(null);
  const [gameId, setGameId] = useLocalStorage("GAME_ID", null);
  const [playerUniqueId, setPlayerUniqueId] = useLocalStorage(
    "PLAYER_UNIQUE_ID",
    null,
  );
  const [playerName, setPlayerName] = useLocalStorage("PLAYER_NAME", null);

  const handleStartGame = () => {
    setPopup({ title: "Your Player Name" });
  };

  const handleClosePopup = () => {
    setPopup(null);
  };

  const handleSubmitPopup = (name) => {
    if (!name) return;
    setPopup(null);

    apiPost("/game/start", { initialPlayerName: name }).then((data) => {
      const { _id, players } = data;
      const { playerUniqueId, playerName } = players[0]; // Your are the first player who create the game
      setGameId(_id);
      setPlayerName(playerName);
      setPlayerUniqueId(playerUniqueId);
      navigate(`/game/${_id}`);
    });
  };

  return (
    <div style={{ textAlign: "center", paddingTop: "50px" }}>
      <h1 style={{ paddingBottom: "20px" }}>
        Welcome to Goose and Academic Predator
      </h1>
      <button
        onClick={handleStartGame}
        style={{
          padding: "12px 30px",
          fontSize: "18px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Start Game
      </button>

      <ShortAnswerPopup
        open={!!popup}
        payload={popup}
        onClose={handleClosePopup}
        onSubmit={handleSubmitPopup}
      />
    </div>
  );
}
