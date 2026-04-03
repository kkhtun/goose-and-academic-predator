// import { useLocalStorage } from "@uidotdev/usehooks";
import useLocalStorage from "../hooks/useLocalStorage";
import DiceRoller from "./DiceRoller";

export default function GameControls({
    isCurrentTurn,
    points = 0,
    position = 0,
    lastRoll,
    onRoll,
    onQuit,
}) {
    const [gameState, _] = useLocalStorage("GAME_STATE", null);
    const { playerUniqueId, gameInfo } = gameState;
    const player = gameInfo.players.find(
        (p) => p.playerUniqueId === playerUniqueId,
    );

    return (
        <div style={styles.panel} className="game-panel">
            <h2 style={styles.title}>Game Status</h2>

            <div style={styles.section}>
                <strong>Player:</strong> {player?.playerName || "UNK"}
            </div>

            <div style={styles.section}>
                <strong>Turn:</strong>{" "}
                <span style={{ color: isCurrentTurn ? "#27ae60" : "#c0392b" }}>
                    {isCurrentTurn ? "Your turn" : "Waiting..."}
                </span>
            </div>

            <div style={styles.section}>
                <strong>Score:</strong> {points}
            </div>

            <div style={styles.section}>
                <strong>Last Roll:</strong> {lastRoll ?? "-"}
            </div>

            <DiceRoller singleDie={position >= 85} onResult={onRoll} />

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
};
