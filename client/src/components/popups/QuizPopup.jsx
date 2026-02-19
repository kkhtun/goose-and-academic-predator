import { useLocalStorage } from "@uidotdev/usehooks";
import React, { useState } from "react";
import { apiPost } from "../../api";

export default function QuizPopup({
  open,
  onClose,
  payload = {},
  handleScore,
}) {
  if (!open) return null;

  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const [gameId, setGameId] = useLocalStorage("GAME_ID", null);
  const [playerUniqueId, setPlayerUniqueId] = useLocalStorage(
    "PLAYER_UNIQUE_ID",
    null,
  );
  const {
    options,
    questionText,
    correctAnswer,
    explanation,
    _id: quizId,
  } = payload;

  const handleClose = () => {
    setHasAnswered(false);
    setIsCorrect(false);
    onClose();
  };

  const handleSubmit = (opt) => {
    // Handle logic for answer check and feedback
    apiPost(`/game/${gameId}/check-answer`, {
      playerUniqueId,
      quizId,
      answer: opt,
    }).then((data) => {
      const { isCorrect, game } = data;
      setHasAnswered(true);
      setIsCorrect(isCorrect);

      if (isCorrect) {
        handleScore(game, playerUniqueId);
      }
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        background: "rgba(0,0,0,0.4)",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 420,
          maxWidth: "100%",
          background: "#ffffff",
          borderRadius: 12,
          padding: 18,
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 20, fontSize: 18 }}>
            {questionText}
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSubmit(String.fromCharCode(65 + i))}
                disabled={hasAnswered}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: 16,
                  textAlign: "left",
                }}
              >
                <span style={{ fontWeight: 700 }}>
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
              </button>
            ))}
          </div>

          {hasAnswered && isCorrect && (
            <div
              style={{
                marginTop: 12,
                padding: 12,
                borderRadius: 8,
                background: "#f0f9ff",
                border: "1px solid #0ea5e9",
              }}
            >
              <div
                style={{ color: "#0369a1", fontWeight: 600, marginBottom: 6 }}
              >
                ✓ Your answer is correct!
              </div>
              <div style={{ color: "#0369a1", fontSize: 14 }}>
                {explanation}
              </div>
            </div>
          )}

          {hasAnswered && !isCorrect && (
            <div
              style={{
                marginTop: 12,
                padding: 12,
                borderRadius: 8,
                background: "#fef2f2",
                border: "1px solid #f87171",
              }}
            >
              <div
                style={{ color: "#dc2626", fontWeight: 600, marginBottom: 6 }}
              >
                ✗ Your answer is incorrect.
              </div>
              <div style={{ color: "#dc2626", fontSize: 14 }}>
                {explanation}
              </div>
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 14,
          }}
        >
          <button
            onClick={handleClose}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: "#f5f5f5",
              cursor: "pointer",
            }}
            disabled={!hasAnswered}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
