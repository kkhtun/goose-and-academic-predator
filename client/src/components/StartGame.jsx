import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiPost } from "../api";
import { useState } from "react";
import "../index.css";
import { avatars } from "./PlayerAvatars";
import useLocalStorage from "../hooks/useLocalStorage";

export default function StartGame() {
    const navigate = useNavigate();
    const [gameState, setGameState] = useLocalStorage("GAME_STATE", {});

    // Component state
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");

    const handleStartGame = () => {
        if (!name) return toast.error("Please enter a valid player name.");
        if (!avatar) return toast.error("Please select a player avatar.");

        apiPost("/game/start", { playerName: name, avatar }).then((data) => {
            const { playerUniqueId, gameInfo } = data;
            const { gameId } = gameInfo;
            navigate(`/game/${gameId}?playerUniqueId=${playerUniqueId}`);
        });
    };

    return (
        <div className="menu-wrapper">
            <div className="menu-card">
                <h3>Choose Your Avatar</h3>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "20px",
                        marginBottom: "25px",
                    }}
                >
                    {avatars.map((av) => (
                        <div
                            key={av.id}
                            onClick={() => setAvatar(av.id)}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                padding: "16px",
                                background: avatar === av.id ? "#EFF6FF" : "#FFFFFF",
                                border: avatar === av.id ? "2px solid #3B82F6" : "1px solid #D6E4F0",
                                borderRadius: "16px",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                width: "110px",
                                color: "#23405A",
                                boxShadow: avatar === av.id ? "0 4px 12px rgba(59, 130, 246, 0.15)" : "0 2px 4px rgba(0,0,0,0.04)",
                            }}
                        >
                            <div style={{ color: av.color }}>{av.icon}</div>
                            <span
                                style={{
                                    marginTop: "8px",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                }}
                            >
                                {av.name}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Player Name Text */}
                <div style={{ marginBottom: "20px", textAlign: "left" }}>
                    <h3 style={{ marginBottom: "6px" }}>Player Name</h3>
                    <input
                        type="text"
                        required
                        placeholder="Enter Player Name"
                        onChange={(e) => setName(e.target.value)}
                        autoFocus={true}
                        style={{
                            width: "100%",
                            padding: "12px 14px",
                            background: "#FFFFFF",
                            border: "1px solid #D6E4F0",
                            borderRadius: 10,
                            fontSize: 15,
                            color: "#23405A",
                            boxSizing: "border-box",
                            outline: "none",
                        }}
                        value={name}
                    />
                </div>

                <button onClick={handleStartGame}>
                    Start Game
                </button>
                <button
                    className="btn-secondary"
                    onClick={() => navigate("/")}
                >
                    Back
                </button>
            </div>
        </div>
    );
}
