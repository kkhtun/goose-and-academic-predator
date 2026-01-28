import React, { useState } from "react";
import { apiPost } from "../api";

export default function StartGame({ onStart, onError }) {
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    try {
      setLoading(true);
      const data = await apiPost("/game/start", {});
      onStart(data);
    } catch (e) {
      onError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 12 }}>
      <h2>Start Game</h2>
      <button onClick={handleStart} disabled={loading}>
        {loading ? "Starting..." : "Start Game"}
      </button>
    </div>
  );
}