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
        <div
            className="menu-wrapper"
            style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                className="menu-card"
                style={{ width: "90%", maxWidth: "600px" }}
            >
                <>
                    <h3 style={{}}>Choose Your Avatar</h3>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "20px",
                            marginBottom: "30px",
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
                                    padding: "20px",
                                    background: "#f0f2f5",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    transition:
                                        "transform 0.2s, boxShadow 0.2s",
                                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                    width: "120px",
                                    ...(avatar === av.id
                                        ? {
                                              background: "rgba(0,0,0,0.2)",
                                          }
                                        : {}),
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform =
                                        "scale(1.05)";
                                    e.currentTarget.style.boxShadow =
                                        "0 6px 12px rgba(0,0,0,0.15)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform =
                                        "scale(1)";
                                    e.currentTarget.style.boxShadow =
                                        "0 4px 6px rgba(0,0,0,0.1)";
                                }}
                            >
                                <div style={{ color: av.color }}>{av.icon}</div>
                                <span
                                    style={{
                                        marginTop: "10px",
                                        fontWeight: "bold",
                                        fontSize: "18px",
                                    }}
                                >
                                    {av.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Player Name Text */}
                    <div style={{}}>
                        <h3 style={{}}>Player Name</h3>
                        <input
                            type="text"
                            required
                            placeholder="Set Player Name"
                            onChange={(e) => setName(e.target.value)}
                            // onKeyDown={handleKeyDown}
                            autoFocus={true}
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #ddd",
                                borderRadius: 6,
                                fontSize: 14,
                                boxSizing: "border-box",
                            }}
                            value={name}
                        />
                    </div>

                    <button
                        onClick={handleStartGame}
                        style={{
                            padding: "12px 30px",
                            fontSize: "18px",
                            marginTop: 30,
                            backgroundColor: "#4CAF50",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Start Game
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        style={{
                            padding: "12px 30px",
                            fontSize: "18px",
                            backgroundColor: "#FEBE10",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Back
                    </button>
                </>
            </div>
        </div>
    );
}
