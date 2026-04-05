import { useEffect } from "react";
// import useLocalStorage from "../hooks/useLocalStorage";
import DiceRoller from "./DiceRoller";
import { findPlayer } from "../utils/common.utils";
import InviteButton from "./InviteButton";

export default function GameControls({
    position = 0,
    lastRoll,
    onRoll,
    onQuit,
    gameState,
    setGameState,
}) {
    // const [gameState, _] = useLocalStorage("GAME_STATE", {});
    const { playerUniqueId, gameInfo } = gameState;
    const { players, gameId } = gameInfo;
    const player = findPlayer(gameInfo, playerUniqueId);

    const nextTurnPlayer = (gameInfo) => {
        const { turnPlayerId } = gameInfo;
        return findPlayer(gameInfo, turnPlayerId);
    };

    const isYourTurn = (gameInfo) => {
        return (
            nextTurnPlayer(gameInfo).playerUniqueId === player.playerUniqueId
        );
    };

    return (
        <div style={styles.panel} className="game-panel">
            <h2 style={styles.title}>Game Status</h2>

            <div style={styles.section}>
                <strong>Player:</strong> {player.playerName || "UNK"}
            </div>

            <div style={styles.section}>
                <strong>Turn:</strong>{" "}
                <span
                    style={{
                        color: isYourTurn(gameInfo) ? "#27ae60" : "#c0392b",
                    }}
                >
                    {nextTurnPlayer(gameInfo).playerName}
                </span>
            </div>

            <div style={styles.section}>
                <strong>Score:</strong> {player.score}
            </div>

            <div style={styles.section}>
                <strong>Last Roll:</strong> {lastRoll ?? "-"}
            </div>

            <DiceRoller
                singleDie={position >= 85}
                onResult={onRoll}
                gameState={gameState}
                setGameState={setGameState}
                isYourTurn={isYourTurn(gameInfo)}
            />

            <div style={{ marginTop: 20 }}>
                <strong>Scores:</strong>
                <div style={styles.scoreList}>
                    {players.map((p) => (
                        <div
                            key={p.playerUniqueId}
                            style={{
                                ...styles.scoreItem,
                                fontWeight:
                                    p.playerUniqueId === player.playerUniqueId
                                        ? "bold"
                                        : "normal",
                            }}
                        >
                            {p.playerName}: {p.score}
                        </div>
                    ))}
                </div>
            </div>

            <InviteButton gameId={gameId} />
            <button style={styles.quitButton} onClick={onQuit}>
                Quit Game
            </button>
        </div>
    );
}

const styles = {
    panel: {
        // position: "fixed",
        // right: 20,
        // top: 20,
        // width: 120,
        padding: 20,
        background: "#1f2933",
        color: "white",
        borderRadius: 12,
        boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
    },
    title: {
        margin: 0,
        textAlign: "center",
    },
    section: {
        fontSize: 15,
    },
    button: {
        marginTop: 10,
        padding: "10px 14px",
        borderRadius: 8,
        border: "none",
        fontSize: 16,
        background: "#3498db",
        color: "white",
    },
    quitButton: {
        marginTop: 6,
        padding: "8px 12px",
        borderRadius: 8,
        border: "none",
        fontSize: 14,
        background: "#e74c3c",
        color: "white",
    },
    scoreList: {
        marginTop: 6,
        display: "flex",
        flexDirection: "column",
        gap: 6,
    },

    scoreItem: {
        padding: "6px 8px",
        borderRadius: 8,
        background: "#273444", // slightly lighter than panel
        fontSize: 14,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
};
