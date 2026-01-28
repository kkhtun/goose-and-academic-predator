import React, { useState } from "react";
import { apiGet } from "../api";

export default function Topics({ topics = [], onTopicsLoaded, onError }) {
  const [loading, setLoading] = useState(false);

  const loadTopics = async () => {
    try {
      setLoading(true);
      const data = await apiGet("/game/mcq-topics");

      const list = Array.isArray(data) ? data : (data?.topics ?? []);
      onTopicsLoaded(list);
    } catch (e) {
      onError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, marginTop: 20 }}>
      <h2>MCQ Topics</h2>
      <button onClick={loadTopics} disabled={loading}>
        {loading ? "Loading..." : "Load Topics"}
      </button>

      <ul>
        {(topics || []).map((t, idx) => (
          <li key={idx}>{String(t)}</li>
        ))}
      </ul>
    </div>
  );
}