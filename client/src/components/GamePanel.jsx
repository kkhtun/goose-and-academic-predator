import React, { useState } from "react";
import { apiGet } from "../api";

export default function GamePanel({ onRoll, onError }) {
  const [loading, setLoading] = useState(false);

  const handleRoll = async () => {
    try {
      setLoading(true);
      const data = await apiGet("/game/roll");
      onRoll(data);
    } catch (e) {
      onError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, marginTop: 20 }}>
      <h2>Game Controls</h2>
      <button onClick={handleRoll} disabled={loading}>
        {loading ? "Rolling..." : "Roll Dice"}
      </button>
    </div>
  );
}