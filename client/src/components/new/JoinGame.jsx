import { useNavigate } from "react-router-dom";
import { apiPost } from "../../api";
import { useState } from "react";
import ShortAnswerPopup from "../popups/ShortAnswerPopup";
import { useLocalStorage } from "@uidotdev/usehooks";
import "../../index.css";
import { avatars } from "../PlayerAvatars";

export default function JoinGame() {
    const navigate = useNavigate();
    const [popup, setPopup] = useState(null);
    const [gameId, setGameId] = useLocalStorage("GAME_ID", null);
    const [playerUniqueId, setPlayerUniqueId] = useLocalStorage(
        "PLAYER_UNIQUE_ID",
        null,
    );
    const [playerName, setPlayerName] = useLocalStorage("PLAYER_NAME", null);
    const [playerAvatar, setPlayerAvatar] = useLocalStorage(
        "PLAYER_AVATAR",
        "dog",
    );

    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [url, setURL] = useState("");

    const extractGameId = (urlString) => {
        try {
            const url = new URL(urlString);
            const parts = url.pathname.split("/").filter(Boolean);

            if (parts.length === 2 && parts[0] === "game") {
                return parts[1];
            }
            return null;
        } catch {
            return null;
        }
    };

    const handleJoinGame = () => {
        const gameId = extractGameId(url);
        if (!gameId) return;
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

                    {/* Game URL Text */}
                    <div style={{}}>
                        <h3 style={{}}>Game URL</h3>
                        <input
                            type="text"
                            required
                            placeholder="Game URL"
                            onChange={(e) => setURL(e.target.value)}
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
                            value={url}
                        />
                    </div>

                    <button
                        onClick={handleJoinGame}
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
                        Join Game
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

                {/* <ShortAnswerPopup
                    open={!!popup}
                    payload={popup}
                    onClose={handleClosePopup}
                    onSubmit={handleSubmitPopup}
                /> */}
            </div>
        </div>
    );
}
