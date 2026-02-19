import DiceRoller from "./DiceRoller";

export default function GameControls({
  playerName,
  isCurrentTurn,
  points = 0,
  lastRoll,
  onRoll,
  onQuit,
}) {
  return (
    <div style={styles.panel}>
      <h2 style={styles.title}>Game Status</h2>

      <div style={styles.section}>
        <strong>Player:</strong> {playerName}
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

      <DiceRoller onResult={onRoll} />

      <button style={styles.quitButton} onClick={onQuit}>
        Quit Game
      </button>
    </div>
  );
}

const styles = {
  panel: {
    position: "fixed",
    right: 20,
    top: 20,
    width: 240,
    padding: 20,
    background: "#1f2933",
    color: "white",
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
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
