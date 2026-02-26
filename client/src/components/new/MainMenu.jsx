import { useNavigate } from "react-router-dom";
import { apiPost } from "../../api";
import { useState } from "react";
import { FaDog, FaCat, FaCrow, FaFish } from "react-icons/fa";
import { GiCamel } from "react-icons/gi";
import ShortAnswerPopup from "../popups/ShortAnswerPopup";
import { useLocalStorage } from "@uidotdev/usehooks";
import "../../index.css";

export default function MainMenu() {
  const navigate = useNavigate();
  const [popup, setPopup] = useState(null);
  const [gameId, setGameId] = useLocalStorage("GAME_ID", null);
  const [playerUniqueId, setPlayerUniqueId] = useLocalStorage(
    "PLAYER_UNIQUE_ID",
    null,
  );
  const [playerName, setPlayerName] = useLocalStorage("PLAYER_NAME", null);
  const [playerAvatar, setPlayerAvatar] = useLocalStorage("PLAYER_AVATAR", "dog");
  const [showAvatars, setShowAvatars] = useState(false);

  const avatars = [
    { id: "dog", icon: <FaDog size={64} />, name: "Dog", color: "#6c5ce7" },
    { id: "cat", icon: <FaCat size={64} />, name: "Cat", color: "#e84393" },
    { id: "bird", icon: <FaCrow size={64} />, name: "Bird", color: "#00b894" },
    { id: "fish", icon: <FaFish size={64} />, name: "Fish", color: "#0984e3" },
    { id: "camel", icon: <GiCamel size={64} />, name: "Camel", color: "#e17055" },
  ];

  const handleStartGame = () => {
    setShowAvatars(true);
  };

  const handleAvatarSelect = (id) => {
    setPlayerAvatar(id);
    setShowAvatars(false);
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
    <div className="menu-wrapper">
      <div className="menu-card">
        {showAvatars ? (
          <>
            <h2 style={{ paddingBottom: "20px" }}>Choose Your Avatar</h2>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", marginBottom: "30px" }}>
              {avatars.map((av) => (
                <div
                  key={av.id}
                  onClick={() => handleAvatarSelect(av.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "20px",
                    background: "#f0f2f5",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "transform 0.2s, boxShadow 0.2s",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    width: "120px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                  }}
                >
                  <div style={{ color: av.color }}>{av.icon}</div>
                  <span style={{ marginTop: "10px", fontWeight: "bold", fontSize: "18px" }}>{av.name}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowAvatars(false)}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Back
            </button>
          </>
        ) : (
          <>
            <div className="goose-avatar"></div>
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
          </>
        )}

        <ShortAnswerPopup
          open={!!popup}
          payload={popup}
          onClose={handleClosePopup}
          onSubmit={handleSubmitPopup}
        />
      </div>
    </div>
  );
}
