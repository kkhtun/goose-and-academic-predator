import { useNavigate } from "react-router-dom";
import { apiPost } from "../api";
import { toast } from "react-toastify";
import { useState } from "react";
import "../index.css";
import { avatars } from "./PlayerAvatars";
import useLocalStorage from "../hooks/useLocalStorage";

export default function JoinGame() {
    const navigate = useNavigate();

    // Component states
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [gameId, setGameId] = useState("");

    const handleJoinGame = () => {
        if (!name) return toast.error("Please enter a valid player name.");
        if (!avatar) return toast.error("Please select a player avatar.");
        if (!gameId) return toast.error("Please provide a valid game ID.");

        apiPost("/game/add-player", { gameId, playerName: name, avatar })
            .then((data) => {
                const { playerUniqueId, gameInfo } = data;
                const { gameId } = gameInfo;
                navigate(`/game/${gameId}?playerUniqueId=${playerUniqueId}`);
            })
            .catch((err) => toast.error(err.message));
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
                                background: avatar === av.id ? "#2563eb" : "#111827",
                                border: avatar === av.id ? "2px solid #60a5fa" : "1px solid #374151",
                                borderRadius: "16px",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                width: "110px",
                                color: "#f8fafc",
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
                <div style={{ marginBottom: "15px", textAlign: "left" }}>
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
                            background: "#111827",
                            border: "1px solid #374151",
                            borderRadius: 10,
                            fontSize: 15,
                            color: "#f8fafc",
                            boxSizing: "border-box",
                            outline: "none",
                        }}
                        value={name}
                    />
                </div>

                {/* Game ID Text */}
                <div style={{ marginBottom: "25px", textAlign: "left" }}>
                    <h3 style={{ marginBottom: "6px" }}>Game ID</h3>
                    <input
                        type="text"
                        required
                        placeholder="Enter Game ID"
                        onChange={(e) => setGameId(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "12px 14px",
                            background: "#111827",
                            border: "1px solid #374151",
                            borderRadius: 10,
                            fontSize: 15,
                            color: "#f8fafc",
                            boxSizing: "border-box",
                            outline: "none",
                        }}
                        value={gameId}
                    />
                </div>

                <button onClick={handleJoinGame}>
                    Join Game
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
