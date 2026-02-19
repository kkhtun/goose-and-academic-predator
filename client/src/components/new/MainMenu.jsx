import { useNavigate } from "react-router-dom";
import "../../index.css";

export default function MainMenu() {
  const navigate = useNavigate();

  const handleStartGame = () => {
    const newId = Date.now();
    navigate(`/game/${newId}`);
  };

  return (
    <div className="menu-wrapper">
      <div className="menu-card">
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
      </div>
    </div>
  );
}
